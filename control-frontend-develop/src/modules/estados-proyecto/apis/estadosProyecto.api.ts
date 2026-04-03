import { api } from '@/config/axios';
import { IResponse } from '@/config/axios/interfaces';
import { ICreateEstadoProyecto, IEstadoProyecto, IEstadosProyectoResponseDB } from '../interfaces/estadosProyecto.interface';

export const getEstadosProyecto = async (): Promise<IEstadoProyecto[]> => {
    const res = await api.get<IEstadosProyectoResponseDB>('/estados-proyecto');
    return res.data.data;
};

export const createEstadoProyecto = async (data: ICreateEstadoProyecto): Promise<IResponse<any>> => {
    const res = await api.post<IResponse<any>>('/estados-proyecto', data);
    return res.data;
};

export const updateEstadoProyecto = async (data: ICreateEstadoProyecto): Promise<IResponse<any>> => {
    const res = await api.put<IResponse<any>>('/estados-proyecto', data);
    return res.data;
};

export const deleteEstadoProyecto = async (id: number): Promise<IResponse<any>> => {
    const res = await api.delete<IResponse<any>>(`/estados-proyecto/${id}`);
    return res.data;
};
