import { IPaginationResponse, IResponse } from '@/config/axios/interfaces';

export interface IProjectDB {
    id_proyecto: number;
    nombre: string;
    descripcion: string;
    tipo: 'Nuevo Sistema' | 'Actualización' | 'Mantenimiento';
    estado: 'Planeación' | 'Desarrollo' | 'Pruebas' | 'Liberado';
    fecha_inicio: string | null;
    fecha_fin_estimada: string | null;
    fecha_creacion: string;
    fecha_modificacion: string;
    activo: boolean;
}

export interface IProjectMapped {
    idProyecto: number;
    nombre: string;
    descripcion: string;
    tipo: 'Nuevo Sistema' | 'Actualización' | 'Mantenimiento';
    estado: 'Planeación' | 'Desarrollo' | 'Pruebas' | 'Liberado';
    fechaInicio: Date | null;
    fechaFinEstimada: Date | null;
    fechaCreacion: Date;
    fechaModificacion: Date;
    activo: boolean;
}

export type IProjectPaginatedResponseDB = IResponse<
    IPaginationResponse<IProjectDB>
>;
export type IProjectPaginatedResponse = IResponse<
    IPaginationResponse<IProjectMapped>
>;

// Public Status
export interface IProjectStatusDB {
    id_proyecto: number;
    nombre: string;
    estado: 'Planeación' | 'Desarrollo' | 'Pruebas' | 'Liberado';
    tipo: 'Nuevo Sistema' | 'Actualización' | 'Mantenimiento';
    fecha_inicio: string | null;
    fecha_fin_estimada: string | null;
}

export interface IProjectStatusMapped {
    idProyecto: number;
    nombre: string;
    estado: 'Planeación' | 'Desarrollo' | 'Pruebas' | 'Liberado';
    tipo: 'Nuevo Sistema' | 'Actualización' | 'Mantenimiento';
    fechaInicio: Date | null;
    fechaFinEstimada: Date | null;
}
export type IProjectStatusResponseDB = IResponse<IProjectStatusDB[]>;
export type IProjectStatusResponse = IResponse<IProjectStatusMapped[]>;

export interface ICreateProject
    extends Pick<
        IProjectDB,
        'nombre' | 'descripcion' | 'tipo' | 'estado' | 'fecha_inicio' | 'fecha_fin_estimada'
    > {
    id_proyecto?: number;
}
