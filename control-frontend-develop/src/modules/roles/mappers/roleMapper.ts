import {
    IRolesCreatedDB,
    IRolesCreatedMapped,
    IRolesPaginatedDB,
    IRolesPaginatedMapped,
    IRolesUpdatedDB,
    IRolesUpdatedMapped,
} from '../interfaces';

export class RoleMapper {
    static toRolPaginate(role: IRolesPaginatedDB): IRolesPaginatedMapped {
        const {
            id_rol: idRole,
            nombre_rol: nombreRole,
            fecha_creacion: fechaCreacion,
            fecha_modificacion: fechaModificacion,
            roles_operaciones: rolesOperaciones,
        } = role;

        return {
            idRole: Number(idRole),
            nombreRole: String(nombreRole),
            fechaCreacion: new Date(fechaCreacion),
            fechaModificacion: new Date(fechaModificacion),
            rolesOperaciones,
        };
    }

    static toRolPaginateArray(
        roles: IRolesPaginatedDB[],
    ): IRolesPaginatedMapped[] {
        return roles.map(this.toRolPaginate);
    }

    static toRolCreated(role: IRolesCreatedDB): IRolesCreatedMapped {
        const {
            id_rol: idRol,
            nombre_rol: nombreRole,
            activo,
            id_usuario_creacion: idUsuarioCreacion,
            fecha_creacion: fechaCreacion,
            id_usuario_modificacion: idUsuarioModificacion,
            fecha_modificacion: fechaModificacion,
        } = role;

        return {
            idRol: Number(idRol),
            nombreRole: String(nombreRole),
            activo: Boolean(activo),
            idUsuarioCreacion: Number(idUsuarioCreacion),
            idUsuarioModificacion: Number(idUsuarioModificacion),
            fechaCreacion: new Date(fechaCreacion),
            fechaModificacion: new Date(fechaModificacion),
        };
    }

    static toRolUpdated(role: IRolesUpdatedDB): IRolesUpdatedMapped {
        const { id_rol_updated: idRolUpdated } = role;

        return {
            idRol: Number(idRolUpdated),
        };
    }
}
