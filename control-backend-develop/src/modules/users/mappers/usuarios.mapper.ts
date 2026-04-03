import { RolesUsuariosEntity } from 'src/modules/users/entities/roles-usuarios.entity';
import { UsuariosSistemaEntity } from '../entities/usuarios-sistema.entity';
import { IUserLoggedDataMapped } from '../../auth/interfaces/login.interfaces';
import {
    IGetOperacionesUsuario,
    IUserCreateMapped,
    IUserPaginatedMapped,
    IUserUpdateMapped,
} from '../interfaces/usuarios.interface';

export class UsuariosMapper {
    static toUserPaginatedMapped(
        usuario: UsuariosSistemaEntity,
    ): IUserPaginatedMapped {
        return {
            id_usuario_sistema: usuario.id_usuario_sistema,
            nombre_usuario: usuario.nombre_usuario,
            activo: usuario.activo,
            fecha_creacion: usuario.fecha_creacion,
            fecha_modificacion: usuario.fecha_modificacion,
            roles:
                usuario.roles_asignados &&
                usuario.roles_asignados.map((rol) => rol.rol.id_rol),
        };
    }

    static toUserCreateMapped(
        usuario: UsuariosSistemaEntity,
    ): IUserCreateMapped {
        return {
            id_usuario_sistema: usuario.id_usuario_sistema,
            nombre_usuario: usuario.nombre_usuario,
            activo: usuario.activo,
            fecha_creacion: usuario.fecha_creacion,
            fecha_modificacion: usuario.fecha_modificacion,
            roles:
                usuario.roles_asignados &&
                usuario.roles_asignados.map((rol) => rol.rol.id_rol),
        };
    }

    static toUserUpdateMapped(
        usuario: UsuariosSistemaEntity,
    ): IUserUpdateMapped {
        return {
            id_usuario_sistema_updated: usuario.id_usuario_sistema,
        };
    }

    static toGetOperacionesUsuario(
        rolesUsuario: RolesUsuariosEntity[],
    ): IGetOperacionesUsuario {
        if (
            !rolesUsuario.every(
                (rolUsuario) =>
                    rolUsuario.rol && rolUsuario.rol.roles_operaciones,
            )
        ) {
            throw new Error(
                'La relación de rol o roles_operaciones no está correctamente configurada',
            );
        }

        const modulos = new Set<number>();
        const operaciones = new Set<number>();

        rolesUsuario.forEach((rolUsuario) => {
            rolUsuario.rol.roles_operaciones.forEach((rolOperacion) => {
                if (rolOperacion.activo) {
                    operaciones.add(rolOperacion.operacion_modulo.id_operacion);
                    modulos.add(rolOperacion.operacion_modulo.modulo.id_modulo);
                }
            });
        });

        return {
            modulos: Array.from(modulos),
            operaciones: Array.from(operaciones),
        };
    }

    static toDataUserLoggedMapped(
        usuario: UsuariosSistemaEntity,
    ): IUserLoggedDataMapped {
        return {
            id_usuario_sistema: usuario.id_usuario_sistema,
            nombre_usuario: usuario.nombre_usuario,
        };
    }
}
