import {
    ICreateUser,
    ICreateUserResponseDB,
    ICreateUserResponseMapped,
    IUpdateUser,
    IUserPaginatedResponseMapped,
    IUsersPaginatedResponseDB,
    IUserUpdateResponseMapped,
    IUserUpdateResponseDB,
} from '../interfaces';
import { api } from '@/config/axios';
import { UserMapper } from '../mappers';
import { IPaginationQuery, IResponse } from '@/config/axios/interfaces';

export const getUsersPaginated = async (
    params?: IPaginationQuery,
): Promise<IUserPaginatedResponseMapped> => {
    const res = await api.get<IUsersPaginatedResponseDB>('/usuarios', {
        params,
    });
    const data = res.data;
    const users = data.data.data;
    const usersMapped = UserMapper.toUserPaginatedArray(users);
    return {
        message: data.message,
        data: {
            data: usersMapped,
            meta: data.data.meta,
            links: data.data.links,
        },
    };
};

export const createUser = async (
    user: ICreateUser,
): Promise<ICreateUserResponseMapped | null> => {
    const res = await api.post<ICreateUserResponseDB>('/usuarios', user);
    const userMapped = res.data.data
        ? UserMapper.toUserCreateMapped(res.data.data)
        : null;
    return { message: res.data.message, data: userMapped };
};

export const updateUser = async (
    user: IUpdateUser,
): Promise<IUserUpdateResponseMapped> => {
    const res = await api.put<IUserUpdateResponseDB>('/usuarios', user);
    const userMapped = UserMapper.toUserUpdateMapped(res.data.data);
    return { message: res.data.message, data: userMapped };
};

export const deleteUser = async (id: number): Promise<IResponse<boolean>> => {
    const res = await api.delete<IResponse<boolean>>(`/usuarios/${id}`);
    return {
        message: res.data.message,
        data: res.data.data,
    };
};

export const restoreUser = async (id: number): Promise<IResponse<boolean>> => {
    const res = await api.patch<IResponse<boolean>>(`/usuarios/restore/${id}`);
    return {
        message: res.data.message,
        data: res.data.data,
    };
};
