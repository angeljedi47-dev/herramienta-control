import { LucideIcon } from 'lucide-react';
import { IFilterField } from '../interfaces';

export interface IOperatorOption {
    label: string;
    value: string;
    symbol: string | LucideIcon;
    className?: string;
    description?: string;
    supportedTypes: (
        | 'text'
        | 'number'
        | 'select'
        | 'date'
        | 'multiselect'
        | 'checkbox'
    )[];
}

export interface IDataTableFiltersProps {
    fields: IFilterField[];
    onFilterChange: (
        filters: Record<string, string>,
        shouldReset?: boolean,
    ) => void;
    filterOnChange?: boolean;
}

export type FilterValue =
    | string
    | number[]
    | string[]
    | boolean
    | null
    | undefined;

export type FilterFormType = {
    [key: string]:
        | FilterValue
        | {
              [key: string]: FilterValue;
          }
        | undefined;
};
