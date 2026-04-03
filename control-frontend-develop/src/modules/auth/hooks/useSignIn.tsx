import { signIn } from '../apis';
import { signInSchema } from '../schemas';
import { ISignInData } from '../interfaces';
import { useMutationForm } from '@/hooks';

interface IUseSignInProps {
    onSuccess?: (data: ISignInData) => void;
}

const useSignIn = ({ onSuccess }: IUseSignInProps) => {
    const { form, handleSubmit, isPending } = useMutationForm({
        schema: signInSchema,
        defaultValues: {
            nombreUsuario: '',
            password: '',
        },
        mutationKey: ['SIGN_IN'],
        mutationFn: (data) =>
            signIn({
                nombre_usuario: data.nombreUsuario,
                password: data.password,
            }),
        errorMapping: {
            nombreUsuario: 'nombre_usuario',
            password: 'password',
        },
        cbSuccess: (response) => {
            if (response) {
                onSuccess?.(response.data);
            }
        },
    });

    return { form, handleSubmit, isPending };
};

export default useSignIn;
