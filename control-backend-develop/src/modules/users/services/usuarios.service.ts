import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosSistemaEntity } from '../entities/usuarios-sistema.entity';
import {
    IUserCreateMapped,
    IUserPaginatedMapped,
    IUserUpdateMapped,
} from '../interfaces/usuarios.interface';
import { UsuariosMapper } from '../mappers/usuarios.mapper';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { USER_PAGINATION_CONFIG } from 'src/modules/users/const/users.const';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { UsuariosValidationService } from './usuarios-validation.service';
import { RolesUsuariosService } from './roles-usuarios.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(UsuariosSistemaEntity)
        private readonly usuariosRepository: Repository<UsuariosSistemaEntity>,
        private readonly usuariosValidationService: UsuariosValidationService,
        private readonly rolesUsuariosService: RolesUsuariosService,
    ) {}

    async findAll(
        query: PaginateQuery,
    ): Promise<Paginated<IUserPaginatedMapped>> {
        const queryBuilder = this.usuariosRepository
            .createQueryBuilder('usuarios_sistema')
            .leftJoinAndSelect(
                'usuarios_sistema.roles_asignados',
                'roles_asignados',
                'roles_asignados.activo = :activo',
                { activo: true },
            )
            .leftJoinAndSelect('roles_asignados.rol', 'rol');

        const result = await paginate<UsuariosSistemaEntity>(
            query,
            queryBuilder,
            USER_PAGINATION_CONFIG,
        );

        return {
            data: result.data.map(UsuariosMapper.toUserPaginatedMapped),
            meta: result.meta as Paginated<IUserPaginatedMapped>['meta'],
            links: result.links,
        };
    }

    @Transactional()
    async create(
        createUsuarioDto: CreateUsuarioDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<IUserCreateMapped> {
        await this.usuariosValidationService.validateForCreateUsuario(
            createUsuarioDto,
        );

        const hashedPassword = bcrypt.hashSync(createUsuarioDto.password);

        const usuarioGuardado = await this.usuariosRepository.save({
            nombre_usuario: createUsuarioDto.nombre_usuario,
            password: hashedPassword,
            activo: true,
            id_usuario_creacion: userAuthenticated.id,
        });

        await this.rolesUsuariosService.assignRolesToUser(
            usuarioGuardado,
            createUsuarioDto.roles,
            userAuthenticated,
        );

        return UsuariosMapper.toUserCreateMapped(usuarioGuardado);
    }

    @Transactional()
    async update(
        updateUsuarioDto: UpdateUsuarioDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<IUserUpdateMapped> {
        const usuario =
            await this.usuariosValidationService.validateForUpdateUsuario(
                updateUsuarioDto,
            );

        const datosActualizacion: Partial<UsuariosSistemaEntity> = {
            nombre_usuario: updateUsuarioDto.nombre_usuario,
            id_usuario_modificacion: userAuthenticated.id,
        };

        if (updateUsuarioDto.password) {
            datosActualizacion.password = bcrypt.hashSync(
                updateUsuarioDto.password,
            );
        }

        await this.usuariosRepository.update(
            updateUsuarioDto.id_usuario_sistema,
            datosActualizacion,
        );

        await this.rolesUsuariosService.updateUserRoles(
            usuario,
            updateUsuarioDto.roles,
            userAuthenticated,
        );

        const usuarioActualizado = await this.usuariosRepository.findOneOrFail({
            where: {
                id_usuario_sistema: updateUsuarioDto.id_usuario_sistema,
            },
        });

        return UsuariosMapper.toUserUpdateMapped(usuarioActualizado);
    }

    @Transactional()
    async delete(
        id_usuario_sistema: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<boolean> {
        await this.usuariosValidationService.validateForDeleteUsuario(
            id_usuario_sistema,
        );

        await this.rolesUsuariosService.deactivateUserRoles(
            id_usuario_sistema,
            userAuthenticated,
        );

        await this.usuariosRepository.update(id_usuario_sistema, {
            activo: false,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return true;
    }

    @Transactional()
    async restore(
        id_usuario_sistema: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<boolean> {
        await this.usuariosValidationService.validateForRestoreUsuario(
            id_usuario_sistema,
        );

        await this.usuariosRepository.update(id_usuario_sistema, {
            activo: true,
            id_usuario_modificacion: userAuthenticated.id,
        });
        return true;
    }

    async obtenerOperacionesUsuario(id_usuario_sistema: number) {
        const rolesUsuario =
            await this.rolesUsuariosService.findActiveUserRoles(
                id_usuario_sistema,
            );
        return UsuariosMapper.toGetOperacionesUsuario(rolesUsuario);
    }

    async getActiveUserByUserName(nombre_usuario: string) {
        const usuario = await this.usuariosRepository.findOne({
            where: { nombre_usuario, activo: true },
        });

        return usuario;
    }

    async getDataUserLogged(id_usuario_sistema: number) {
        const usuario = await this.usuariosRepository.findOne({
            where: { id_usuario_sistema, activo: true },
        });
        return UsuariosMapper.toDataUserLoggedMapped(usuario);
    }
}
