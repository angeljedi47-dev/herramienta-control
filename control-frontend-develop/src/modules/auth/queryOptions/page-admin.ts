import { validateToken } from '@/modules/auth/apis';
import { queryOptions } from '@tanstack/react-query';

export const validateTokenOptions = queryOptions({
    queryKey: ['VALIDATE_TOKEN'],
    queryFn: validateToken,
});
