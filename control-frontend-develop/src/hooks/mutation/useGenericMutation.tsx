import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IUseGenericMutation } from './interfaces';
import { handleError } from './utils';

export const useGenericMutation = <
    TData = unknown,
    TError = unknown,
    TVariables = void,
>({
    mutationKey,
    mutationFn,
    queryKeyToInvalidate,
    cbSuccess,
    cbError,
}: IUseGenericMutation<TData, TError, TVariables>) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey,
        mutationFn,
        onSuccess: (data) => {
            if (queryKeyToInvalidate) {
                queryClient.invalidateQueries({
                    queryKey: queryKeyToInvalidate,
                });
            }
            toast.success(data.message || 'Operación exitosa');
            cbSuccess?.(data);
        },
        onError: (error: TError) => {
            if (cbError) {
                cbError(error);
            } else {
                handleError(error);
            }
        },
    });
};
