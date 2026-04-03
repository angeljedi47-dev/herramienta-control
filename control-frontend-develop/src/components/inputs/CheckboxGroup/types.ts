import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export type PropertyMapper<T> = keyof T | ((item: T) => string);

export type CheckboxValue = string | number;

export interface ICheckboxGroupProps<
    T extends FieldValues,
    K extends Record<string, unknown> = Record<string, unknown>,
> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    error?: string;

    disabled?: boolean;
    className?: string;
    options: K[];
    propertiesMapped?: {
        value: PropertyMapper<K>;
        label: PropertyMapper<K>;
    };
}

export interface ICheckboxGroupItemProps {
    option: {
        id: CheckboxValue;
        label: string;
    };
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}
