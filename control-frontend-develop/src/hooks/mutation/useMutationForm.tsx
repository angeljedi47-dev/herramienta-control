import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IUseMutationFormProps } from './interfaces';
import { handleError } from './utils';

export const useMutationForm = <T extends FieldValues, R>({
    schema,
    defaultValues,
    mutationKey,
    mutationFn,
    errorMapping,
    cbSuccess,
    cbError,
}: IUseMutationFormProps<T, R>) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const mutation = useMutation({
        mutationKey,
        mutationFn,
    });

    const handleSubmit = async (values: T) => {
        try {
            const response = await mutation.mutateAsync(values);
            cbSuccess?.(response);
            toast.success(response?.message || 'Operación exitosa');
        } catch (error) {
            cbError?.();
            handleError(error, form, errorMapping);
        }
    };

    return { form, handleSubmit, ...mutation };
};

export default useMutationForm;
