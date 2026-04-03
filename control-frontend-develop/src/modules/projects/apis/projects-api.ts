import { api } from '@/config/axios';
import { IPaginationQuery, IResponse } from '@/config/axios/interfaces';
import {
    ICreateProject,
    IProjectPaginatedResponse,
    IProjectPaginatedResponseDB,
    IProjectStatusResponse,
    IProjectStatusResponseDB,
} from '../interfaces';
import { ProjectMapper } from '../mappers';

export const getProjectsPaginate = async (
    params?: IPaginationQuery,
): Promise<IProjectPaginatedResponse> => {
    const projects = await api.get<IProjectPaginatedResponseDB>('/proyectos', {
        params,
    });
    
    const projectsMapped = ProjectMapper.toPaginateArray(projects.data.data.data);
    return {
        message: projects.data.message,
        data: {
            data: projectsMapped,
            meta: projects.data.data.meta,
            links: projects.data.data.links,
        },
    };
};

export const getProjectsPublicStatus = async (): Promise<IProjectStatusResponse> => {
    const status = await api.get<IProjectStatusResponseDB>('/proyectos/public/status');
    const statusMapped = ProjectMapper.toStatusArray(status.data.data);

    return {
        message: status.data.message,
        data: statusMapped,
    };
};

export const createProject = async (
    projectData: ICreateProject,
): Promise<IResponse<any>> => {
    const res = await api.post<IResponse<any>>('/proyectos', projectData);
    return res.data;
};

export const updateProject = async (
    projectData: ICreateProject,
): Promise<IResponse<any>> => {
    const res = await api.put<IResponse<any>>('/proyectos', projectData);
    return res.data;
};

export const deleteProject = async (id: number): Promise<IResponse<boolean>> => {
    const res = await api.delete<IResponse<boolean>>(`/proyectos/${id}`);
    return {
        message: res.data.message,
        data: res.data.data,
    };
};
