import {
    IUserCreateDB,
    IUserCreateMapped,
    IUserPaginatedDB,
    IUserPaginatedMapped,
    IUserUpdateDB,
    IUserUpdateMapped,
} from '../interfaces';

export class UserMapper {
    static toUserPaginatedMapped(user: IUserPaginatedDB): IUserPaginatedMapped {
        const {
            id_usuario_sistema: idUsuarioSistema,
            nombre_usuario: nombreUsuario,
            activo,
            fecha_creacion: fechaCreacion,
            fecha_modificacion: fechaModificacion,
            roles,
        } = user;

        return {
            idUsuarioSistema: Number(idUsuarioSistema),
            nombreUsuario: String(nombreUsuario),
            activo: Boolean(activo),
            fechaCreacion: new Date(fechaCreacion),
            fechaModificacion: new Date(fechaModificacion),
            roles: roles ? roles.map((role) => Number(role)) : [],
        };
    }

    static toUserPaginatedArray(
        users: IUserPaginatedDB[],
    ): IUserPaginatedMapped[] {
        return users.map(this.toUserPaginatedMapped);
    }

    static toUserCreateMapped(user: IUserCreateDB): IUserCreateMapped {
        const {
            id_usuario_sistema: idUsuarioSistema,
            nombre_usuario: nombreUsuario,
            activo,
            fecha_creacion: fechaCreacion,
            fecha_modificacion: fechaModificacion,
            roles,
        } = user;

        return {
            idUsuarioSistema: Number(idUsuarioSistema),
            nombreUsuario: String(nombreUsuario),
            activo: Boolean(activo),
            fechaCreacion: new Date(fechaCreacion),
            fechaModificacion: new Date(fechaModificacion),
            roles: roles ? roles.map((role) => Number(role)) : [],
        };
    }

    static toUserUpdateMapped(user: IUserUpdateDB): IUserUpdateMapped {
        const { id_usuario_sistema_updated: idUsuarioSistemaUpdated } = user;

        return {
            idUsuarioSistema: Number(idUsuarioSistemaUpdated),
        };
    }
}
