import { IPaginationResponse, IResponse } from '@/config/axios/interfaces';

export interface IRolesPaginatedDB {
    id_rol: number;
    nombre_rol: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    roles_operaciones: number[];
}

export interface IRolesPaginatedMapped {
    idRole: number;
    nombreRole: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    rolesOperaciones: number[];
}

export type IRolesPaginatedResponseDB = IResponse<
    IPaginationResponse<IRolesPaginatedDB>
>;
export type IRolesPaginatedResponse = IResponse<
    IPaginationResponse<IRolesPaginatedMapped>
>;

export interface IRolesCreatedDB {
    nombre_rol: string;
    activo: boolean;
    id_usuario_creacion: number | null;
    id_usuario_modificacion: number | null;
    id_rol: number;
    fecha_creacion: string;
    fecha_modificacion: string;
}

export interface IRolesCreatedMapped {
    nombreRole: string;
    activo: boolean;
    idUsuarioCreacion: number | null;
    idUsuarioModificacion: number | null;
    idRol: number;
    fechaCreacion: Date;
    fechaModificacion: Date;
}

export type IRolesResponseDBCreate = IResponse<IRolesCreatedDB>;
export type IRolesResponseCreate = IResponse<IRolesCreatedMapped>;

export interface IRolesUpdatedDB {
    id_rol_updated: number | null;
}

export interface IRolesUpdatedMapped {
    idRol: number | null;
}

export type IRolesResponseDBUpdate = IResponse<IRolesUpdatedDB>;
export type IRolesResponseUpdate = IResponse<IRolesUpdatedMapped>;

export type IRolesResponseByTermDB = IResponse<IRolesPaginatedDB[]>;
export type IRolesResponseByTerm = IResponse<IRolesPaginatedMapped[]>;

export interface ICreateRol
    extends Pick<IRolesPaginatedDB, 'nombre_rol'>,
        Partial<Pick<IRolesPaginatedDB, 'id_rol'>> {
    operaciones: number[];
}
