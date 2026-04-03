import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export interface ICheckboxProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    allowIndeterminate?: boolean;
}
