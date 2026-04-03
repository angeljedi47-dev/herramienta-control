import { IResponse } from '@/config/axios/interfaces';

export interface IEstadoProyecto {
    id_estado_proyecto: number;
    nombre: string;
    color_hex: string;
    es_final: boolean;
    activo: boolean;
}

export type IEstadosProyectoResponseDB = IResponse<IEstadoProyecto[]>;
export type IEstadoProyectoResponse = IResponse<IEstadoProyecto>;

export interface ICreateEstadoProyecto {
    id_estado_proyecto?: number;
    nombre: string;
    color_hex?: string;
    es_final?: boolean;
}
