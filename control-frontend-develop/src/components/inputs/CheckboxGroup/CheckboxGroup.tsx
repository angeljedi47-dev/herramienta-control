/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxValue, ICheckboxGroupProps, PropertyMapper } from './types';
import { FieldValues } from 'react-hook-form';

const getPropertyValue = <T extends Record<string, unknown>>(
    item: T,
    property: PropertyMapper<T>,
): string => {
    if (typeof property === 'function') {
        return property(item);
    }
    return String(item[property]);
};

const CheckboxGroup = <
    T extends FieldValues,
    K extends Record<string, any> = Record<string, any>,
>({
    form,
    name,
    label,
    options,
    description,

    disabled,
    className,
    propertiesMapped = {
        value: 'id' as keyof K,
        label: 'label' as keyof K,
    },
}: ICheckboxGroupProps<T, K>) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn('space-y-3', className)}>
                    {label && <FormLabel>{label}</FormLabel>}
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <div className="space-y-3">
                        {options.map((option) => {
                            const value = getPropertyValue(
                                option,
                                propertiesMapped.value,
                            );
                            const label = getPropertyValue(
                                option,
                                propertiesMapped.label,
                            );

                            return (
                                <FormItem
                                    key={value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.some(
                                                (val: CheckboxValue) =>
                                                    String(val) === value,
                                            )}
                                            onCheckedChange={(checked) => {
                                                const currentValue =
                                                    Number(value) || value;
                                                const updatedValue = checked
                                                    ? [
                                                          ...(field.value ||
                                                              []),
                                                          currentValue,
                                                      ]
                                                    : (
                                                          field.value || []
                                                      ).filter(
                                                          (
                                                              val: CheckboxValue,
                                                          ) =>
                                                              String(val) !==
                                                              String(
                                                                  currentValue,
                                                              ),
                                                      );
                                                field.onChange(updatedValue);
                                            }}
                                            disabled={disabled}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {label}
                                    </FormLabel>
                                </FormItem>
                            );
                        })}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default CheckboxGroup;
