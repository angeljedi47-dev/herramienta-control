import { RolesEntity } from 'src/modules/roles/entities/roles.entity';
import {
    IRolesByTermMapped,
    IRolesCreateMapped,
    IRolesPaginatedMapped,
    IUpdateRolMapped,
} from 'src/modules/roles/interfaces/roles.interface';

export class RolesMapper {
    static toRolesPaginated(roles: RolesEntity): IRolesPaginatedMapped {
        return {
            id_rol: roles.id_rol,
            nombre_rol: roles.nombre_rol,
            fecha_creacion: roles.fecha_creacion,
            fecha_modificacion: roles.fecha_modificacion,
            roles_operaciones: roles.roles_operaciones.map(
                (roleOperation) => roleOperation.operacion_modulo.id_operacion,
            ),
        };
    }

    static toRolesByTerm(roles: RolesEntity): IRolesByTermMapped {
        return {
            id_rol: roles.id_rol,
            nombre_rol: roles.nombre_rol,
            fecha_creacion: roles.fecha_creacion,
            fecha_modificacion: roles.fecha_modificacion,
            roles_operaciones: roles.roles_operaciones.map(
                (roleOperation) => roleOperation.operacion_modulo.id_operacion,
            ),
        };
    }

    static toRolCreated(rol: RolesEntity): IRolesCreateMapped {
        return {
            nombre_rol: rol.nombre_rol,
            activo: rol.activo,
            id_usuario_creacion: rol.id_usuario_creacion,
            id_usuario_modificacion: rol.id_usuario_modificacion,
            id_rol: rol.id_rol,
            fecha_creacion: rol.fecha_creacion,
            fecha_modificacion: rol.fecha_modificacion,
        };
    }

    static toRolUpdated(id: number): IUpdateRolMapped {
        return {
            id_rol_updated: id,
        };
    }
}
