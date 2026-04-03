import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/modules/roles/entities/roles.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from '../dtos/create-rol.dto';
import { UpdateRolDto } from '../dtos/update-rol.dto';
import { RolesOperacionesService } from './roles-operaciones.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ROLE_PAGINATION_CONFIG } from 'src/modules/roles/const/roles.const';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';
import { RolesMapper } from 'src/modules/roles/mappers/roles.mapper';
import {
    IRolesByTermMapped,
    IRolesCreateMapped,
    IRolesPaginatedMapped,
    IUpdateRolMapped,
} from 'src/modules/roles/interfaces/roles.interface';
import { RolesValidationService } from './roles-validation.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,
        private rolesOperacionesService: RolesOperacionesService,
        private rolesValidationService: RolesValidationService,
    ) {}

    async findAll(
        query: PaginateQuery,
    ): Promise<Paginated<IRolesPaginatedMapped>> {
        const queryBuilder = await this.rolesRepository
            .createQueryBuilder('roles')
            .leftJoinAndSelect(
                'roles.roles_operaciones',
                'roles_operaciones',
                'roles_operaciones.activo = :activo',
                { activo: true },
            )
            .leftJoinAndSelect(
                'roles_operaciones.operacion_modulo',
                'operacion_modulo',
            )
            .where('roles.activo = :activo', { activo: true });

        const result = await paginate<RolesEntity>(
            query,
            queryBuilder,
            ROLE_PAGINATION_CONFIG,
        );

        return {
            data: result.data.map(RolesMapper.toRolesPaginated),
            meta: result.meta as Paginated<IRolesPaginatedMapped>['meta'],
            links: result.links,
        };
    }

    async findByTerm(term: string): Promise<IRolesByTermMapped[]> {
        const queryBuilder = await this.rolesRepository
            .createQueryBuilder('roles')
            .leftJoinAndSelect(
                'roles.roles_operaciones',
                'roles_operaciones',
                'roles_operaciones.activo = :activo',
                { activo: true },
            )
            .leftJoinAndSelect(
                'roles_operaciones.operacion_modulo',
                'operacion_modulo',
            )
            .where('roles.activo = :activo', { activo: true })
            .orderBy('roles.fecha_modificacion', 'DESC')
            .take(10);

        if (term) {
            queryBuilder.andWhere('LOWER(roles.nombre_rol) LIKE LOWER(:term)', {
                term: `%${term}%`,
            });
        }

        const roles = await queryBuilder.getMany();
        return roles.map(RolesMapper.toRolesByTerm);
    }

    @Transactional()
    async create(
        createRolDto: CreateRolDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<IRolesCreateMapped> {
        await this.rolesValidationService.validateForCreateRol(createRolDto);

        const nuevoRol = await this.rolesRepository.save({
            nombre_rol: createRolDto.nombre_rol,
            activo: true,
            id_usuario_creacion: userAuthenticated.id,
        });

        await this.rolesOperacionesService.activarOcrearOperacionesDeRol(
            nuevoRol.id_rol,
            createRolDto.operaciones,
            userAuthenticated.id,
        );

        return RolesMapper.toRolCreated(nuevoRol);
    }

    @Transactional()
    async update(
        id: number,
        updateRolDto: UpdateRolDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<IUpdateRolMapped> {
        await this.rolesValidationService.validateForUpdateRol(
            id,
            updateRolDto,
        );

        await this.rolesRepository.update(id, {
            nombre_rol: updateRolDto.nombre_rol,
            id_usuario_modificacion: userAuthenticated.id,
        });

        const operacionesActuales =
            await this.rolesOperacionesService.findOperacionesByRolId(id);
        const idsOperacionesActuales = operacionesActuales.map(
            (op) => op.operacion_modulo.id_operacion,
        );

        const operacionesDtoSet = new Set(updateRolDto.operaciones);

        const idsOperacionesADesactivar = idsOperacionesActuales.filter(
            (idOpActual) => !operacionesDtoSet.has(idOpActual),
        );

        if (idsOperacionesADesactivar.length > 0) {
            await this.rolesOperacionesService.desactivarOperacionesDeRol(
                id,
                idsOperacionesADesactivar,
                userAuthenticated.id,
            );
        }

        await this.rolesOperacionesService.activarOcrearOperacionesDeRol(
            id,
            updateRolDto.operaciones,
            userAuthenticated.id,
        );

        return RolesMapper.toRolUpdated(id);
    }

    @Transactional()
    async delete(
        id: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<boolean> {
        await this.rolesValidationService.validateForDeleteRol(id);

        const operacionesActuales =
            await this.rolesOperacionesService.findOperacionesByRolId(id);
        const idsOperacionesADesactivar = operacionesActuales.map(
            (op) => op.operacion_modulo.id_operacion,
        );

        if (idsOperacionesADesactivar.length > 0) {
            await this.rolesOperacionesService.desactivarOperacionesDeRol(
                id,
                idsOperacionesADesactivar,
                userAuthenticated.id,
            );
        }

        await this.rolesRepository.update(id, {
            activo: false,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return true;
    }
}
