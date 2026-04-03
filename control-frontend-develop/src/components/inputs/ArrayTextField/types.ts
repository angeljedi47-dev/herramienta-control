import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

export interface IArrayTextFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    isRequired?: boolean;
    maxItems?: number;
}
