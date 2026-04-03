import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/modules/roles/entities/roles.entity';
import { Not, Repository } from 'typeorm';
import { CreateRolDto } from '../dtos/create-rol.dto';
import { UpdateRolDto } from '../dtos/update-rol.dto';
import { RolesOperacionesValidationService } from './roles-operaciones-validation.service';

@Injectable()
export class RolesValidationService {
    constructor(
        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,
        private readonly rolesOperacionesValidationService: RolesOperacionesValidationService,
    ) {}

    async validateRolNombreAvailable(
        nombreRol: string,
        currentRolId?: number,
    ): Promise<void> {
        const queryOptions: any = {
            where: { nombre_rol: nombreRol, activo: true },
        };
        if (currentRolId) {
            queryOptions.where.id_rol = Not(currentRolId);
        }
        const rol = await this.rolesRepository.findOne(queryOptions);
        if (rol) {
            throw new BadRequestException(
                `El nombre de rol '${nombreRol}' ya está en uso.`,
            );
        }
    }

    async validateRolExistsAndActive(idRol: number): Promise<RolesEntity> {
        const rol = await this.rolesRepository.findOne({
            where: { id_rol: idRol, activo: true },
        });
        if (!rol) {
            throw new BadRequestException(
                `El rol con ID '${idRol}' no existe o está inactivo.`,
            );
        }
        return rol;
    }

    async validateRolNoTieneUsuariosAsignados(idRol: number): Promise<void> {
        const usuariosConRol = await this.rolesRepository
            .createQueryBuilder('roles')
            .innerJoin('roles.usuarios_con_rol', 'roles_usuarios')
            .where('roles.id_rol = :idRol', { idRol })
            .andWhere('roles_usuarios.activo = :activo', { activo: true })
            .getCount();

        if (usuariosConRol > 0) {
            throw new BadRequestException(
                'No se puede modificar/eliminar el rol porque existen usuarios activos que lo tienen asignado.',
            );
        }
    }

    async validateForCreateRol(dto: CreateRolDto): Promise<void> {
        await this.validateRolNombreAvailable(dto.nombre_rol);
        await this.rolesOperacionesValidationService.validateOperacionesExist(
            dto.operaciones,
        );
    }

    async validateForUpdateRol(
        idRol: number,
        dto: UpdateRolDto,
    ): Promise<void> {
        await this.validateRolExistsAndActive(idRol);
        await this.validateRolNombreAvailable(dto.nombre_rol, idRol);
        await this.rolesOperacionesValidationService.validateOperacionesExist(
            dto.operaciones,
        );
    }

    async validateForDeleteRol(idRol: number): Promise<void> {
        await this.validateRolExistsAndActive(idRol);
        await this.validateRolNoTieneUsuariosAsignados(idRol);
    }
}
