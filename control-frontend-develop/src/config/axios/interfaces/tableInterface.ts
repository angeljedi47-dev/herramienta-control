import { IPropertiesMapped } from '@/components/inputs/Combobox/types';
import { SearchFn } from '@/components/inputs/Combobox';
import { QueryKey } from '@tanstack/react-query';

export interface IPaginationResponse<T> {
    data: T[];
    meta: {
        itemsPerPage: number;
        totalItems?: number;
        currentPage?: number;
        totalPages?: number;
        search: string;
        select: string[];
        filter?: {
            [column: string]: string | string[];
        };
        cursor?: string;
        firstCursor?: string;
        lastCursor?: string;
    };
    links: {
        first?: string;
        previous?: string;
        current: string;
        next?: string;
        last?: string;
    };
}

export interface IFilterOperator {
    $eq?: string;
    $gt?: string;
    $gte?: string;
    $in?: string[];
    $null?: boolean;
    $lt?: string;
    $lte?: string;
    $btw?: [string, string];
    $ilike?: string;
    $sw?: string;
    $contains?: string | string[];
    $not?: IFilterOperator;
}

export type IOperatorForSelect = Pick<IFilterOperator, '$eq' | '$in'>;
export type IOperatorForTextNumber = Pick<
    IFilterOperator,
    '$eq' | '$in' | '$ilike' | '$contains'
>;

export interface IFilterFieldCommon {
    name: string;
    label: string;
}

export interface IFilterFieldTextNumber extends IFilterFieldCommon {
    type: 'text' | 'number';
    operators: (keyof IOperatorForTextNumber)[];
}

export interface IFilterFieldSelect<TData> extends IFilterFieldCommon {
    type: 'select' | 'multiselect';
    operators: (keyof IOperatorForSelect)[];
    options: { label: string; value: string | number }[];
    searchFn: SearchFn<TData>;
    queryKey: QueryKey;
    propertiesMapped: IPropertiesMapped<TData>;
    debounceMs?: number;
}

export interface IFilterFieldDate extends IFilterFieldCommon {
    type: 'date';
    operators: ('$eq' | '$gte' | '$lte' | '$btw')[];
}

export type IFilterField<TData = unknown> =
    | IFilterFieldTextNumber
    | IFilterFieldSelect<TData>
    | IFilterFieldDate;

export interface IPaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string[];
    [key: string]: string | number | undefined | string[];
}
