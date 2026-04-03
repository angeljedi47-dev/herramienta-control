import { useQueryClient } from '@tanstack/react-query';
import { createRolSchema } from '../schemas';
import { IRolesPaginatedMapped } from '../interfaces';
import { createRol, updateRol } from '../apis';
import { useMutationForm } from '@/hooks';

interface IUseCreateRolProps {
    onSuccess: () => void;
    rolToEdit?: IRolesPaginatedMapped;
}

const useCreateRol = ({ onSuccess, rolToEdit }: IUseCreateRolProps) => {
    const queryClient = useQueryClient();

    const { form, handleSubmit, isPending } = useMutationForm({
        schema: createRolSchema,
        defaultValues: {
            idRol: rolToEdit?.idRole || 0,
            nombreRol: rolToEdit?.nombreRole || '',
            operaciones: rolToEdit?.rolesOperaciones || [],
        },
        errorMapping: {
            idRol: 'id_rol',
            nombreRol: 'nombre_rol',
            operaciones: 'operaciones',
        },
        mutationKey: ['CREATE_ROL'],
        mutationFn: (data) => {
            if (rolToEdit) {
                return updateRol({
                    id_rol: rolToEdit.idRole,
                    nombre_rol: data.nombreRol,
                    operaciones: data.operaciones,
                });
            }
            return createRol({
                nombre_rol: data.nombreRol,
                operaciones: data.operaciones,
            });
        },
        cbSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['GET_ROLES'] });
                onSuccess();
            }
        },
    });

    return { form, handleSubmit, isPending };
};

export default useCreateRol;
