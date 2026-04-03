import { IPropertiesMapped } from '@/components/inputs/Combobox/types';
import { SearchFn } from '@/components/inputs/Combobox';
import { QueryKey, UseQueryResult } from '@tanstack/react-query';
import { IResponse } from './responseInterface';
import { IAction } from '@/components/actions/ActionMenu';
import { ColumnDef, Table as TableInstance } from '@tanstack/react-table';
import { ReactNode } from '@tanstack/react-router';

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
export type IOperatorForCheckbox = Pick<IFilterOperator, '$eq'>;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IFilterFieldSelect<TData extends object = any>
    extends IFilterFieldCommon {
    type: 'select' | 'multiselect';
    operators: (keyof IOperatorForSelect)[];
    options: { label: string; value: string | number }[];
    searchFn: SearchFn<TData>;
    queryKey: QueryKey;
    propertiesMapped: IPropertiesMapped<TData>;
    debounceMs?: number;
}

export interface IFilterFieldCheckbox extends IFilterFieldCommon {
    type: 'checkbox';
    operators: (keyof IOperatorForCheckbox)[];
}

export interface IFilterFieldDate extends IFilterFieldCommon {
    type: 'date';
    operators: ('$eq' | '$gte' | '$lte' | '$btw')[];
}

export type IFilterField =
    | IFilterFieldTextNumber
    | IFilterFieldSelect
    | IFilterFieldDate
    | IFilterFieldCheckbox;

export interface IPaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string[];
    [key: string]: string | number | undefined | string[];
}

export type ViewMode = 'table' | 'custom';

export interface ICustomLayoutOptions {
    type?: 'grid' | 'list';
    cols?: number; // aplica para grid
    className?: string;
}

export interface ICustomRendererContext<TData> {
    actions?: IAction<TData>[];
}
export interface ICustomItemRendererProps<TData> {
    item: TData;
    index: number;
    context: ICustomRendererContext<TData>;
    queryResult: UseQueryResult<IResponse<IPaginationResponse<TData>>, Error>;
}
export interface IActionOfTable<T> {
    label: string;
    icon?: React.ReactNode;
    onClick?: (data: { pagination: IPaginationQuery; data: T[] }) => void;
    disabled?: boolean;
    className?: string;
}

export interface IDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    actions?: IAction<TData>[];
    queryKey: QueryKey;
    queryFn: (
        params: IPaginationQuery,
    ) => Promise<IResponse<IPaginationResponse<TData>>>;
    initialPagination?: IPaginationQuery;
    filterFields?: IFilterField[];
    filterOnChange?: boolean;
    actionsTable?: IActionOfTable<TData>[];
    viewMode?: ViewMode; // default 'table'
    renderItem?: (props: ICustomItemRendererProps<TData>) => ReactNode;
    customLayout?: ICustomLayoutOptions;
}

export interface IDataTableContentProps<TData, TValue> {
    table: TableInstance<TData>;
    columns: ColumnDef<TData, TValue>[];
    isLoading: boolean;
    data: TData[];
}

export interface IDataTableGoToPageProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export interface IDataTablePageSizeProps {
    value: number;
    options: number[];
    onChange: (value: string) => void;
}

export interface IDataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}
