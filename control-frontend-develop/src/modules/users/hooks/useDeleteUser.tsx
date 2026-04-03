import { useGenericMutation } from '@/hooks/mutation';
import { deleteUser } from '../apis';

interface IUseDeleteUserProps {
    onSuccess?: () => void;
}

const useDeleteUser = ({ onSuccess }: IUseDeleteUserProps) => {
    const mutation = useGenericMutation<boolean, Error, number>({
        mutationKey: ['DELETE_USER'],
        mutationFn: deleteUser,
        queryKeyToInvalidate: ['PAGINATION_USERS'],
        cbSuccess: () => {
            onSuccess?.();
        },
    });

    return { ...mutation };
};

export default useDeleteUser;
