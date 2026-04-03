import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ReactNode } from 'react';
import { QueryKey } from '@tanstack/react-query';
import { IResponse } from '@/config/axios/interfaces';

export interface IComboboxOption {
    label: string;
    value: string | number;
}

export interface IPropertiesMapped<TData> {
    label: keyof TData | ((data: TData) => string);
    value: keyof TData;
}

export type SearchFn<TData> = (term: string) => Promise<IResponse<TData[]>>;

export interface IComboboxProps<T extends FieldValues, TData = unknown> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    description?: string;
    containerClassName?: string;

    isRequired?: boolean;
    propertiesMapped?: IPropertiesMapped<TData>;
    isMulti?: boolean;
    isSearchable?: boolean;
    isDisabled?: boolean;
    onOpenChange?: (open: boolean) => void;
    mode?: 'form' | 'filter';
    rightElement?: ReactNode;

    // Nuevas props para búsqueda backend
    searchFn?: SearchFn<TData>;
    queryKey?: QueryKey;
    debounceMs?: number;

    // Props para agregar elementos cuando no hay opciones
    showAddButton?: boolean;
    addButtonText?: string;
    onAddClick?: () => void;

    // Prop para obtener el elemento seleccionado del catalogo
    getElementSelected?: (element: TData) => void;

    // Prop para obtener el elemento deseleccionado del catalogo
    getElementDeselected?: (element: TData) => void;

    // Prop para determinar si un elemento está deshabilitado
    isItemDisabled?: (element: TData) => boolean;
}
