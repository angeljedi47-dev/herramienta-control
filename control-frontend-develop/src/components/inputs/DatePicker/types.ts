import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import { DatePickerProps } from 'react-datepicker';

interface IBaseDatePickerProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    label: string;
    datePickerOptions?: DatePickerProps & {
        errorClassName?: string;
        containerClassName?: string;
    };
    description?: string;
    isRequired?: boolean;
    mode?: 'form' | 'filter';
    tooltip?: string;
    rightElement?: ReactNode;
    type?: 'single' | 'range';
}

export interface ISingleDatePickerProps<T extends FieldValues>
    extends IBaseDatePickerProps<T> {
    type?: 'single';
    name: FieldPath<T>;
}

export interface IRangeDatePickerProps<T extends FieldValues>
    extends IBaseDatePickerProps<T> {
    type: 'range';
    startDateName: FieldPath<T>;
    endDateName: FieldPath<T>;
    startDateLabel?: string;
    endDateLabel?: string;
}

export type IUnifiedDatePickerProps<T extends FieldValues> =
    | ISingleDatePickerProps<T>
    | IRangeDatePickerProps<T>;
