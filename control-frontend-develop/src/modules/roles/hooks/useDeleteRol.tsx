import { useGenericMutation } from '@/hooks/mutation';
import { deleteRol } from '../apis';

interface IUseDeleteRolProps {
    onSuccess?: () => void;
}

const useDeleteRol = ({ onSuccess }: IUseDeleteRolProps) => {
    const mutation = useGenericMutation<boolean, Error, number>({
        mutationKey: ['DELETE_ROL'],
        mutationFn: deleteRol,
        queryKeyToInvalidate: ['GET_ROLES'],
        cbSuccess: () => {
            onSuccess?.();
        },
    });
    return { ...mutation };
};

export default useDeleteRol;
