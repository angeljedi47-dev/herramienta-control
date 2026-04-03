import { IResponse } from '@/config/axios/interfaces';
import { IProjectMapped, IProjectStatusMapped } from '../../projects/interfaces';

export interface ITipoInforme {
    id_tipo_informe: number;
    nombre: string;
    slug: string;
    activo: boolean;
}

export interface ITipoInformePublicStatus {
    id_tipo_informe: number;
    nombre: string;
    slug: string;
    proyectos: any[]; // Lo conectaremos luego
}

export type ITiposInformeResponseDB = IResponse<ITipoInforme[]>;
export type ITipoInformeResponse = IResponse<ITipoInforme>;

export interface ICreateTipoInforme {
    id_tipo_informe?: number;
    nombre: string;
    slug: string;
}
