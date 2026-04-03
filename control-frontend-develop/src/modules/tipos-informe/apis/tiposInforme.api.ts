import { api } from '@/config/axios';
import { ICreateTipoInforme, ITipoInforme, ITipoInformeResponse, ITiposInformeResponseDB } from '../interfaces/tiposInforme.interface';
import { IResponse } from '@/config/axios/interfaces';

export const getTiposInforme = async (): Promise<ITipoInforme[]> => {
    const res = await api.get<ITiposInformeResponseDB>('/tipos-informe');
    return res.data.data;
};

export const getTipoInformePublicStatus = async (slug: string): Promise<any> => {
    const res = await api.get(`/tipos-informe/public/status/${slug}`);
    return res.data.data;
};

export const createTipoInforme = async (data: ICreateTipoInforme): Promise<IResponse<any>> => {
    const res = await api.post<IResponse<any>>('/tipos-informe', data);
    return res.data;
};

export const updateTipoInforme = async (data: ICreateTipoInforme): Promise<IResponse<any>> => {
    const res = await api.put<IResponse<any>>('/tipos-informe', data);
    return res.data;
};

export const deleteTipoInforme = async (id: number): Promise<IResponse<any>> => {
    const res = await api.delete<IResponse<any>>(`/tipos-informe/${id}`);
    return res.data;
};
