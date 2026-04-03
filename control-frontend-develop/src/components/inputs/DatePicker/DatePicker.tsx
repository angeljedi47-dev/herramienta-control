import { FieldValues, Path, PathValue } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import {
    FormField,
    FormLabel,
    FormItem,
    FormMessage,
    FormControl,
} from '../../ui/form';
import { IUnifiedDatePickerProps } from './types';
import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../../ui/tooltip';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import { useRef } from 'react';

const BASE_INPUT_CLASSNAME = 'input-base w-full';

export const DatePicker = <T extends FieldValues>(
    props: IUnifiedDatePickerProps<T>,
) => {
    const {
        form,
        label,
        datePickerOptions,
        description,
        isRequired,
        mode = 'form',
        tooltip,
        rightElement,
        type = 'single',
    } = props;

    const { containerClassName, errorClassName, ...restDatePickerProps } =
        datePickerOptions || {};
    const endDateRef = useRef<ReactDatePicker>(null);

    const renderLabel = (labelText: string) => (
        <div className="flex items-center gap-1">
            <FormLabel className="flex items-center gap-1">
                {labelText}
                {isRequired && <span className="text-red-500">*</span>}
            </FormLabel>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );

    const renderHeader = (labelText: string) =>
        mode === 'form' ? (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                {renderLabel(labelText)}
                {description && (
                    <span className="text-sm text-muted-foreground sm:text-right">
                        {description}
                    </span>
                )}
            </div>
        ) : (
            renderLabel(labelText)
        );

    const getDatePickerProps = (error?: boolean) => ({
        locale: es,
        dateFormat: restDatePickerProps.showTimeInput
            ? 'dd/MM/yyyy HH:mm'
            : 'dd/MM/yyyy',
        dropdownMode: restDatePickerProps.dropdownMode || 'select',
        wrapperClassName: 'w-full',
        className: `${BASE_INPUT_CLASSNAME} ${error ? errorClassName : ''}`,
        ...restDatePickerProps,
    });

    const renderSingleDatePicker = () => {
        if (!('name' in props)) return null;
        const error = form.formState.errors[props.name];

        return (
            <FormField
                control={form.control}
                name={props.name}
                render={({ field }) => (
                    <FormItem className={containerClassName}>
                        {renderHeader(label)}
                        <div
                            className={
                                mode === 'filter'
                                    ? 'flex gap-2 items-center'
                                    : ''
                            }
                        >
                            <FormControl>
                                <ReactDatePicker
                                    id={props.name}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    {...getDatePickerProps(!!error)}
                                />
                            </FormControl>
                            {mode === 'filter' && rightElement}
                        </div>
                        <div className="flex-1 min-h-[20px]">
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
        );
    };

    const renderRangeDatePicker = () => {
        if (!('startDateName' in props && 'endDateName' in props)) return null;
        const handleStartDateChange = (date: Date | null) => {
            form.setValue(props.startDateName, date as PathValue<T, Path<T>>);
            if (date && endDateRef.current) {
                endDateRef.current.setFocus();
            }
        };

        const handleEndDateChange = (date: Date | null) => {
            form.setValue(props.endDateName, date as PathValue<T, Path<T>>);
        };

        const renderDateField = (
            name: Path<T>,
            value: Date | null,
            onSelect: (date: Date | null) => void,
            fieldLabel: string,
            placeholder: string,
            additionalProps: object = {},
        ) => (
            <FormField
                control={form.control}
                name={name}
                render={() => (
                    <FormItem>
                        <FormLabel>{fieldLabel}</FormLabel>
                        <FormControl>
                            <ReactDatePicker
                                selected={value}
                                onSelect={onSelect}
                                placeholderText={placeholder}
                                {...getDatePickerProps(
                                    !!form.formState.errors[name],
                                )}
                                {...additionalProps}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );

        return (
            <FormItem className={containerClassName}>
                {renderHeader(label)}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderDateField(
                        props.startDateName,
                        form.watch(props.startDateName),
                        handleStartDateChange,
                        props.startDateLabel || 'Fecha inicial',
                        'Selecciona fecha inicial',
                        {
                            selectsStart: true,
                            startDate: form.watch(props.startDateName),
                            endDate: form.watch(props.endDateName),
                        },
                    )}
                    {renderDateField(
                        props.endDateName,
                        form.watch(props.endDateName),
                        handleEndDateChange,
                        props.endDateLabel || 'Fecha final',
                        'Selecciona fecha final',
                        {
                            ref: endDateRef,
                            selectsEnd: true,
                            startDate: form.watch(props.startDateName),
                            endDate: form.watch(props.endDateName),
                            minDate: form.watch(props.startDateName),
                        },
                    )}
                </div>
                {mode === 'filter' && rightElement}
            </FormItem>
        );
    };

    if (type === 'single') {
        return renderSingleDatePicker();
    }

    if (type === 'range') {
        return renderRangeDatePicker();
    }

    throw new Error('Configuración inválida');
};
