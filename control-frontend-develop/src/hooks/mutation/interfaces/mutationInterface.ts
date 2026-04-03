import { IResponse } from '@/config/axios/interfaces';
import { MutationKey, QueryKey } from '@tanstack/react-query';
import { FieldValues, Path, UseFormProps } from 'react-hook-form';
import { ZodSchema } from 'zod';

export interface IUseMutationFormProps<T extends FieldValues, R>
    extends Pick<UseFormProps<T>, 'defaultValues'> {
    schema: ZodSchema<T>;
    mutationKey: MutationKey;
    mutationFn: (data: {
        [key in Path<T>]: T[key];
    }) => Promise<IResponse<R> | null>;
    errorMapping: Record<keyof T, string>;
    cbSuccess?: (response: IResponse<R> | null) => void;
    cbError?: () => void;
}

export interface IUseGenericMutation<TData, TError, TVariables> {
    mutationKey: MutationKey;
    mutationFn: (vars: TVariables) => Promise<IResponse<TData>>;
    queryKeyToInvalidate?: QueryKey;
    cbSuccess?: (data: IResponse<TData>) => void;
    cbError?: (error: TError) => void;
}
