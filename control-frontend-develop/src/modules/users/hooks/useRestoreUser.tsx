import { useGenericMutation } from '@/hooks/mutation';
import { restoreUser } from '../apis';

interface IUseRestoreUserProps {
    onSuccess?: () => void;
}

const useRestoreUser = ({ onSuccess }: IUseRestoreUserProps) => {
    const mutation = useGenericMutation<boolean, Error, number>({
        mutationKey: ['RESTORE_USER'],
        mutationFn: restoreUser,
        queryKeyToInvalidate: ['PAGINATION_USERS'],
        cbSuccess: () => {
            onSuccess?.();
        },
    });

    return { ...mutation };
};

export default useRestoreUser;
