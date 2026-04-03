import { IPaginationQuery } from '@/config/axios/interfaces';
import { queryOptions } from '@tanstack/react-query';
import { getProjectsPaginate } from '../apis/projects-api';

export const queryPaginatedGetAllProjectsOptions = (
    params?: IPaginationQuery,
) => {
    return queryOptions({
        queryKey: ['GET_PROJECTS', params],
        queryFn: () => getProjectsPaginate(params),
    });
};
