import { IPaginationQuery } from '@/config/axios/interfaces';
import { getRolesPaginate } from '@/modules/roles/apis';
import { queryOptions } from '@tanstack/react-query';

export const queryPaginatedGetAllRolesOptions = (params: IPaginationQuery) =>
    queryOptions({
        queryKey: ['GET_ROLES', params],
        queryFn: () => getRolesPaginate(params),
    });
