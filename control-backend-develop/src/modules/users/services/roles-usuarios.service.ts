import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesUsuariosEntity } from '../entities/roles-usuarios.entity';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { UsuariosSistemaEntity } from '../entities/usuarios-sistema.entity';
import { DateTimeService } from 'src/config/date-time/date-time.service';

@Injectable()
export class RolesUsuariosService {
    constructor(
        @InjectRepository(RolesUsuariosEntity)
        private readonly rolesUsuariosRepository: Repository<RolesUsuariosEntity>,
        private readonly dateTimeService: DateTimeService,
    ) {}

    async assignRolesToUser(
        usuario: UsuariosSistemaEntity,
        rolesIds: number[],
        userAuthenticated: IUserAuthenticated,
    ): Promise<void> {
        const rolesUsuarioToCreate = rolesIds.map((idRol) => ({
            id_rol: idRol,
            id_usuario_sistema: usuario.id_usuario_sistema,
            id_usuario_creacion: userAuthenticated.id,
            activo: true,
        }));

        await this.rolesUsuariosRepository.save(rolesUsuarioToCreate);
    }

    async findActiveUserRoles(
        idUsuarioSistema: number,
    ): Promise<RolesUsuariosEntity[]> {
        return this.rolesUsuariosRepository.find({
            where: {
                usuario: { id_usuario_sistema: idUsuarioSistema },
                activo: true,
            },
            relations: {
                rol: {
                    roles_operaciones: {
                        operacion_modulo: {
                            modulo: true,
                        },
                    },
                },
            },
        });
    }

    async updateUserRoles(
        usuario: UsuariosSistemaEntity,
        newRolesIds: number[],
        userAuthenticated: IUserAuthenticated,
    ): Promise<void> {
        const currentRoles = await this.findActiveUserRoles(
            usuario.id_usuario_sistema,
        );
        const currentRolesIds = currentRoles.map((ru) => ru.rol.id_rol);

        const rolesToDeactivate = currentRoles.filter(
            (rolActual) => !newRolesIds.includes(rolActual.rol.id_rol),
        );

        if (rolesToDeactivate.length > 0) {
            await this.rolesUsuariosRepository.save(
                rolesToDeactivate.map((rol) => ({
                    ...rol,
                    activo: false,
                    fecha_eliminacion: this.dateTimeService.getCurrentDate(),
                    id_usuario_eliminacion: userAuthenticated.id,
                })),
            );
        }

        const rolesToActivateOrAssignIds = newRolesIds.filter(
            (idRolNuevo) => !currentRolesIds.includes(idRolNuevo),
        );

        if (rolesToActivateOrAssignIds.length > 0) {
            const rolesToAssign = rolesToActivateOrAssignIds.map((idRol) => ({
                id_rol: idRol,
                id_usuario_sistema: usuario.id_usuario_sistema,
                id_usuario_creacion: userAuthenticated.id,
                activo: true,
            }));
            await this.rolesUsuariosRepository.save(rolesToAssign);
        }
    }

    async deactivateUserRoles(
        idUsuarioSistema: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<void> {
        const rolesActivos = await this.findActiveUserRoles(idUsuarioSistema);

        if (rolesActivos.length > 0) {
            await this.rolesUsuariosRepository.save(
                rolesActivos.map((rol) => ({
                    ...rol,
                    activo: false,
                    fecha_eliminacion: this.dateTimeService.getCurrentDate(),
                    id_usuario_eliminacion: userAuthenticated.id,
                })),
            );
        }
    }
}
