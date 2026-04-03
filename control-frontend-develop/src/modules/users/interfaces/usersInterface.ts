import { IPaginationResponse, IResponse } from '@/config/axios/interfaces';

export interface IUserPaginatedDB {
    id_usuario_sistema: number;
    nombre_usuario: string;
    activo: boolean;
    fecha_creacion: string;
    fecha_modificacion: string;
    roles: number[];
}

export interface IUserPaginatedMapped {
    idUsuarioSistema: number;
    nombreUsuario: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;
    roles: number[];
}

export type IUsersPaginatedResponseDB = IResponse<
    IPaginationResponse<IUserPaginatedDB>
>;

export type IUserPaginatedResponseMapped = IResponse<
    IPaginationResponse<IUserPaginatedMapped>
>;

export interface IUserCreateDB {
    id_usuario_sistema: number;
    nombre_usuario: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    roles: number[];
}

export interface IUserCreateMapped {
    idUsuarioSistema: number;
    nombreUsuario: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;
    roles: number[];
}

export type ICreateUserResponseDB = IResponse<IUserCreateDB>;

export type ICreateUserResponseMapped = IResponse<IUserCreateMapped | null>;

export interface IUserUpdateDB {
    id_usuario_sistema_updated: number;
}

export interface IUserUpdateMapped {
    idUsuarioSistema: number;
}

export type IUserUpdateResponseDB = IResponse<IUserUpdateDB>;
export type IUserUpdateResponseMapped = IResponse<IUserUpdateMapped>;

export interface ICreateUser
    extends Pick<IUserCreateDB, 'nombre_usuario'>,
        Partial<Pick<IUserCreateDB, 'id_usuario_sistema'>> {
    password: string;
    roles: number[];
}

export interface IUpdateUser extends Omit<ICreateUser, 'password'> {
    password?: string;
}
