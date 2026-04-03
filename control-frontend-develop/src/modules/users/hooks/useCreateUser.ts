import { useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '../apis';
import { createUserSchema, ICreateUserSchema } from '../schemas';
import { useMutationForm } from '@/hooks';

interface IUseCreateUserProps {
    userToEdit?: ICreateUserSchema;
    cbSuccess?: () => void;
}

const useCreateUser = ({ userToEdit, cbSuccess }: IUseCreateUserProps) => {
    const queryClient = useQueryClient();

    const { form, handleSubmit, isPending } = useMutationForm({
        schema: createUserSchema,
        defaultValues: {
            idUsuario: userToEdit?.idUsuario || 0,
            nombreUsuario: userToEdit?.nombreUsuario || '',
            password: '',
            confirmPassword: '',
            roles: userToEdit?.roles || [],
        },
        mutationKey: ['CREATE_USER'],
        mutationFn: (data) => {
            if (userToEdit) {
                return updateUser({
                    id_usuario_sistema: data.idUsuario,
                    nombre_usuario: data.nombreUsuario,
                    password: data.password,
                    roles: data.roles,
                });
            } else {
                return createUser({
                    nombre_usuario: data.nombreUsuario,
                    password: data.password || '',
                    roles: data.roles,
                });
            }
        },
        errorMapping: {
            idUsuario: 'id_usuario_sistema',
            nombreUsuario: 'nombre_usuario',
            password: 'password',
            confirmPassword: 'confirm_password',
            roles: 'roles',
        },
        cbSuccess: () => {
            cbSuccess?.();
            queryClient.invalidateQueries({
                queryKey: ['PAGINATION_USERS'],
            });
        },
    });

    return { form, handleSubmit, isPending };
};

export default useCreateUser;
