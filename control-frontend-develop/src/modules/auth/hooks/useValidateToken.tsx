import { useMutation } from '@tanstack/react-query';
import { validateToken } from '../apis';

const useValidateToken = () => {
    const mutation = useMutation({
        mutationKey: ['VALIDATE_TOKEN'],
        mutationFn: validateToken,
    });

    return { ...mutation };
};

export default useValidateToken;
