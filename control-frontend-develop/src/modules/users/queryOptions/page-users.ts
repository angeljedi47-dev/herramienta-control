import { IPaginationQuery } from '@/config/axios/interfaces';
import { getUsersPaginated } from '@/modules/users/apis';
import { queryOptions } from '@tanstack/react-query';

export const paginateAllUserOptions = async (params: IPaginationQuery) => {
    return queryOptions({
        queryKey: ['PAGINATION_USERS', params],
        queryFn: () => getUsersPaginated(params),
    });
};
