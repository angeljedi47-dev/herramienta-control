/* Refactorización nueva */
export interface IRolesPaginatedMapped {
    id_rol: number;
    nombre_rol: string;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    roles_operaciones: number[];
}

export interface IRolesByTermMapped {
    id_rol: number;
    nombre_rol: string;
    fecha_creacion: Date;
    fecha_modificacion: Date;
    roles_operaciones: number[];
}

export interface IRolesCreateMapped {
    nombre_rol: string;
    activo: boolean;
    id_usuario_creacion: number | null;
    id_usuario_modificacion: number | null;
    id_rol: number;
    fecha_creacion: Date;
    fecha_modificacion: Date;
}

export interface IUpdateRolMapped {
    id_rol_updated: number | null;
}
