import { cn } from '@/lib/utils';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Checkbox as CheckboxUI } from '@/components/ui/checkbox';
import { ICheckboxProps } from './types';
import { FieldValues, PathValue } from 'react-hook-form';

const CheckField = <T extends FieldValues>({
    form,
    name,
    label,
    description,
    disabled,
    className,
    allowIndeterminate = false,
}: ICheckboxProps<T>) => {
    /**
     * Gestiona la rotación de estados cuando allowIndeterminate está activo
     * Ciclo: null/indeterminate -> true -> false -> null
     */
    const handleIndeterminateChange = (checked: boolean | string) => {
        if (!allowIndeterminate) {
            form.setValue(name, checked as PathValue<T, typeof name>);
            return;
        }

        const currentValue = form.getValues(name);

        // Ciclo: null/indeterminate -> true -> false -> null
        if (
            currentValue === null ||
            currentValue === undefined ||
            currentValue === 'indeterminate'
        ) {
            form.setValue(name, true as PathValue<T, typeof name>);
        } else if (currentValue === true) {
            form.setValue(name, false as PathValue<T, typeof name>);
        } else {
            form.setValue(name, null as PathValue<T, typeof name>);
        }
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
                // Mapear null a "indeterminate" para el componente Radix
                const checkboxValue =
                    field.value === null || field.value === undefined
                        ? 'indeterminate'
                        : field.value;

                return (
                    <FormItem
                        className={cn(
                            'flex flex-row items-start space-x-3 space-y-0',
                            className,
                        )}
                    >
                        <FormControl>
                            <CheckboxUI
                                checked={checkboxValue}
                                onCheckedChange={handleIndeterminateChange}
                                disabled={disabled}
                            />
                        </FormControl>
                        {label && (
                            <div className="space-y-1 leading-none">
                                <FormLabel>{label}</FormLabel>
                                {description && (
                                    <FormDescription>
                                        {description}
                                    </FormDescription>
                                )}
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default CheckField;
