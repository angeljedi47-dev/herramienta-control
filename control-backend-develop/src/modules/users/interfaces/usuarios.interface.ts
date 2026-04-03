export interface IUserPaginatedMapped {
    id_usuario_sistema: number;
    nombre_usuario: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    roles: number[];
}

export interface IUserCreateMapped {
    id_usuario_sistema: number;
    nombre_usuario: string;
    activo: boolean;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    roles: number[];
}

export interface IUserUpdateMapped {
    id_usuario_sistema_updated: number;
}

export interface IGetOperacionesUsuario {
    modulos: number[];
    operaciones: number[];
}
