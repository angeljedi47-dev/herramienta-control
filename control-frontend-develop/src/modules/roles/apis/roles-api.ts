import { api } from '@/config/axios';
import {
    ICreateRol,
    IRolesPaginatedResponse,
    IRolesResponseByTerm,
    IRolesResponseByTermDB,
    IRolesResponseCreate,
    IRolesPaginatedResponseDB,
    IRolesResponseDBCreate,
    IRolesResponseUpdate,
    IRolesResponseDBUpdate,
} from '../interfaces/';
import { RoleMapper } from '../mappers/roleMapper';
import { IPaginationQuery, IResponse } from '@/config/axios/interfaces';

export const getRolesPaginate = async (
    params?: IPaginationQuery,
): Promise<IRolesPaginatedResponse> => {
    const roles = await api.get<IRolesPaginatedResponseDB>('/roles', {
        params,
    });
    const rolesMapped = RoleMapper.toRolPaginateArray(roles.data.data.data);
    return {
        message: roles.data.message,
        data: {
            data: rolesMapped,
            meta: roles.data.data.meta,
            links: roles.data.data.links,
        },
    };
};

export const createRol = async (
    rol_data: ICreateRol,
): Promise<IRolesResponseCreate> => {
    const res = await api.post<IRolesResponseDBCreate>('/roles', rol_data);
    const rolMapped = RoleMapper.toRolCreated(res.data.data);
    return { message: res.data.message, data: rolMapped };
};

export const updateRol = async (
    rol_data: ICreateRol,
): Promise<IRolesResponseUpdate> => {
    const res = await api.put<IRolesResponseDBUpdate>('/roles', rol_data);
    const rolMapped = RoleMapper.toRolUpdated(res.data.data);
    return { message: res.data.message, data: rolMapped };
};

export const deleteRol = async (id: number): Promise<IResponse<boolean>> => {
    const res = await api.delete<IResponse<boolean>>(`/roles/${id}`);
    return {
        message: res.data.message,
        data: res.data.data,
    };
};

export const getRolesByTerm = async (
    term: string,
): Promise<IRolesResponseByTerm> => {
    const res = await api.get<IRolesResponseByTermDB>(`/roles/catalogo/`, {
        params: {
            term,
        },
    });

    const rolesMapped = RoleMapper.toRolPaginateArray(res.data.data);
    return { message: res.data.message, data: rolesMapped };
};
