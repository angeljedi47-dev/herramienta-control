import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ReactNode } from 'react';

export interface ITextFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    inputOptions?: React.ComponentProps<'input'> & {
        errorClassName?: string;
        containerClassName?: string;
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        type?: 'text' | 'password' | 'email' | 'number' | 'textarea';
        numeric?: boolean;
        rows?: number;
    };
    description?: string;
    isRequired?: boolean;
    showCharCounter?: boolean;
    mode?: 'form' | 'filter' | 'textarea';
    tooltip?: string;
    rightElement?: ReactNode;
}
