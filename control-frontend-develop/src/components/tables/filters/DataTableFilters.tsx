import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { TextField } from '../../inputs/TextField/TextField';
import { Combobox } from '../../inputs/Combobox/Combobox';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { IDataTableFiltersProps, FilterFormType } from './types';
import { OPERATOR_OPTIONS } from './constants';
import { createFilterSchema } from './utils';
import { OperatorSelector } from './OperatorSelector';
import { DatePicker } from '../../inputs/DatePicker/DatePicker';
import { startOfDay, endOfDay, format } from 'date-fns';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';
import CheckField from '../../inputs/CheckField/CheckField';
import { IFilterField } from '../interfaces';

/**
 * Componente principal de filtros para DataTable
 * Permite filtrar datos usando diferentes operadores según el tipo de campo
 *
 * @param fields - Array de campos configurados para filtrar
 * @param onFilterChange - Callback que se ejecuta cuando cambian los filtros
 * @param filterOnChange - Si es true, aplica filtros al cambiar. Si es false, requiere click en "Aplicar"
 */
export function DataTableFilters({
    fields,
    onFilterChange,
    filterOnChange = true,
}: IDataTableFiltersProps) {
    // Crear valores iniciales para todos los campos
    const defaultValues = useMemo(() => {
        const values: FilterFormType = {};
        fields.forEach((field) => {
            if (field.type === 'multiselect') {
                values[field.name] = [];
            } else if (field.type === 'checkbox') {
                values[field.name] = null;
            } else {
                values[field.name] = '';
            }

            // Inicializar operadores
            const availableOperators = OPERATOR_OPTIONS.filter((op) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                field.operators.includes(op.value as any),
            );
            if (availableOperators.length > 0) {
                values[`${field.name}_operator`] = availableOperators[0].value;
            }
        });
        return values;
    }, [fields]);

    const form = useForm<FilterFormType>({
        resolver: zodResolver(createFilterSchema(fields)),
        defaultValues,
        // Asegurarnos que los valores se reseteen correctamente
        resetOptions: {
            keepDirtyValues: false,
            keepDefaultValues: true,
        },
    });

    /**
     * Obtiene el valor de un campo anidado usando un path
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNestedValue = (obj: any, path: string[]): any => {
        return path.reduce(
            (acc, part) =>
                acc && acc[part] !== undefined ? acc[part] : undefined,
            obj,
        );
    };

    /**
     * Procesa los datos del formulario y los convierte al formato esperado por el backend
     * Formato: { fieldName: "operator:value" }
     */
    const processFilters = (data: FilterFormType) => {
        const activeFilters: Record<string, string> = {};

        fields.forEach((field) => {
            const fieldPath = field.name.split('.');
            let value =
                fieldPath.length > 1
                    ? getNestedValue(data, fieldPath)
                    : data[field.name];

            const operator = data[`${field.name}_operator`] as string;
            let endValue = data[`${field.name}_end`]?.toString().trim();

            // Si el valor está vacío o es un array vacío, no incluimos este campo
            // Para los campos de tipo checkbox, solo incluimos si es true o false (no null)
            if (
                (!value && value !== false) ||
                (Array.isArray(value) && value.length === 0) ||
                (field.type === 'checkbox' && value === null)
            ) {
                return;
            }

            // Procesar fechas
            if (field.type === 'date') {
                const formatDate = (date: Date) =>
                    format(date, 'yyyy-MM-dd HH:mm:ss.SSS');

                if (operator === '$eq') {
                    const start = startOfDay(new Date(value));
                    const end = endOfDay(new Date(value));
                    activeFilters[field.name] =
                        `$btw:${formatDate(start)},${formatDate(end)}`;
                    return;
                }

                if (operator === '$btw') {
                    // Obtener el valor final directamente del campo _end
                    endValue = data[`${field.name}_end`]?.toString().trim();

                    if (!endValue) {
                        return; // No procesar si no hay fecha final
                    }

                    const start = startOfDay(new Date(value));
                    const end = endOfDay(new Date(endValue));

                    activeFilters[field.name] =
                        `$btw:${formatDate(start)},${formatDate(end)}`;
                    return;
                }

                // Para otros operadores, usar la fecha tal cual
                value = formatDate(new Date(value));
            }

            // Asegurarnos de que los valores sean primitivos
            if (typeof value === 'object' && !Array.isArray(value)) {
                // Si es un objeto, intentamos obtener el valor usando propertiesMapped
                if ('propertiesMapped' in field) {
                    if (field.propertiesMapped?.value) {
                        value = value[field.propertiesMapped.value];
                    }
                }
            }

            // Procesar según el tipo de campo y operador
            switch (operator) {
                case '$btw':
                    if (endValue) {
                        activeFilters[field.name] =
                            `${operator}:${value},${endValue}`;
                    }
                    break;
                case '$null':
                case '$not:$null':
                    activeFilters[field.name] = operator;
                    break;
                default:
                    if (Array.isArray(value)) {
                        // Para multiselect, asegurarnos de que los valores sean primitivos
                        const processedValues = value.map((v) =>
                            typeof v === 'object' &&
                            'propertiesMapped' in field &&
                            field.propertiesMapped?.value
                                ? v[field.propertiesMapped.value]
                                : v,
                        );
                        activeFilters[field.name] =
                            `${operator}:${processedValues.join(',')}`;
                    } else if (field.type === 'checkbox') {
                        const boolValue = value === true ? 'true' : 'false';
                        activeFilters[field.name] = `${operator}:${boolValue}`;
                    } else {
                        activeFilters[field.name] = `${operator}:${value}`;
                    }
            }
        });

        // Solo actualizar si hay cambios en los filtros
        if (Object.keys(activeFilters).length > 0) {
            onFilterChange(activeFilters);
        } else {
            // Si no hay filtros activos, limpiar todo
            onFilterChange({}, true);
        }
    };

    const onSubmit = form.handleSubmit(processFilters);

    useEffect(() => {
        if (!filterOnChange) return;

        const subscription = form.watch(() => {
            const values = form.getValues();
            processFilters(values);
        });
        return () => subscription.unsubscribe();
    }, [form.watch, filterOnChange]);

    const handleReset = () => {
        // Resetear a los valores por defecto
        form.reset(defaultValues);
        onFilterChange({}, true);
    };

    const renderField = (field: IDataTableFiltersProps['fields'][0]) => {
        const commonProps = {
            form,
            name: field.name,
            label: field.label,
            mode: 'filter' as const,
            rightElement: (
                <OperatorSelector
                    field={field as IFilterField}
                    form={form}
                    operators={OPERATOR_OPTIONS}
                />
            ),
        };

        const fieldValue = form.watch(field.name);
        const hasValue = Array.isArray(fieldValue)
            ? fieldValue.length > 0
            : field.type === 'checkbox'
              ? fieldValue !== null &&
                fieldValue !== undefined &&
                fieldValue !== ''
              : fieldValue !== '';

        return (
            <div
                className={cn(
                    'p-3 rounded-lg border transition-all duration-300',
                    'bg-card hover:bg-card/80',
                    hasValue && 'border-primary/20 bg-primary/5',
                    !hasValue && 'border-border/40 hover:border-border/60',
                )}
            >
                {field.type === 'date' ? (
                    <DatePicker
                        {...commonProps}
                        type={
                            form.watch(`${field.name}_operator`) === '$btw'
                                ? 'range'
                                : 'single'
                        }
                        startDateName={field.name}
                        endDateName={`${field.name}_end`}
                        datePickerOptions={{
                            placeholderText: `Seleccionar ${field.label.toLowerCase()}`,
                        }}
                    />
                ) : field.type === 'select' || field.type === 'multiselect' ? (
                    <Combobox
                        {...commonProps}
                        isMulti={field.type === 'multiselect'}
                        searchFn={field.searchFn}
                        queryKey={field.queryKey}
                        propertiesMapped={field.propertiesMapped}
                        debounceMs={field.debounceMs}
                    />
                ) : field.type === 'checkbox' ? (
                    <CheckField
                        {...commonProps}
                        label={`Filtrar por ${field.label.toLowerCase()}`}
                        allowIndeterminate={true}
                    />
                ) : (
                    <TextField
                        {...commonProps}
                        inputOptions={{
                            placeholder: `Buscar por ${field.label.toLowerCase()}`,
                            type: field.type === 'number' ? 'number' : 'text',
                            className: 'w-full focus:ring-primary/20',
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <Accordion type="single" collapsible defaultValue="" className="w-full">
            <AccordionItem
                value="filters"
                className="border rounded-lg overflow-hidden"
            >
                <AccordionTrigger className="px-4 py-3 hover:no-underline group data-[state=open]:border-b">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                <Search className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-foreground/90">
                                Filtros de búsqueda
                            </span>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Form {...form}>
                        <form onSubmit={onSubmit} className="p-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fields.map((field) => (
                                    <div key={field.name}>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t flex-wrap">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleReset}
                                    className="flex items-center gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 w-full sm:w-auto"
                                >
                                    <FilterX className="w-4 h-4" />
                                    Limpiar
                                </Button>
                                {!filterOnChange && (
                                    <Button
                                        type="submit"
                                        className="flex items-center gap-2 w-full sm:w-auto"
                                    >
                                        <Search className="w-4 h-4" />
                                        Aplicar filtros
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
