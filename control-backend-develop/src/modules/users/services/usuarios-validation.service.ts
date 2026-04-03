import {
    Injectable,
    ConflictException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UsuariosSistemaEntity } from '../entities/usuarios-sistema.entity';
import { RolesValidationService } from 'src/modules/roles/services/roles-validation.service';
import { UpdateUsuarioDto } from '../dtos/update-usuario.dto';
import { CreateUsuarioDto } from '../dtos/create-usuario.dto';

@Injectable()
export class UsuariosValidationService {
    constructor(
        @InjectRepository(UsuariosSistemaEntity)
        private readonly usuariosRepository: Repository<UsuariosSistemaEntity>,
        private readonly rolesValidationService: RolesValidationService,
    ) {}

    async validateUserExists(
        idUsuarioSistema: number,
    ): Promise<UsuariosSistemaEntity> {
        const usuario = await this.usuariosRepository.findOne({
            where: { id_usuario_sistema: idUsuarioSistema },
        });
        if (!usuario) {
            throw new NotFoundException('El usuario no existe');
        }
        return usuario;
    }

    async validateUserIsActive(usuario: UsuariosSistemaEntity): Promise<void> {
        if (usuario.activo === false) {
            throw new BadRequestException(
                'No se puede editar un usuario inhabilitado, primero debe habilitarlo y posterior editarlo',
            );
        }
    }

    async validateUserIsNotActive(
        usuario: UsuariosSistemaEntity,
    ): Promise<void> {
        if (usuario.activo === true) {
            throw new BadRequestException(
                'El usuario ya se encuentra habilitado',
            );
        }
    }

    async validateUserNotExistsByUsername(
        nombreUsuario: string,
        currentUserId?: number,
    ): Promise<void> {
        const whereCondition: any = { nombre_usuario: nombreUsuario };
        if (currentUserId) {
            whereCondition.id_usuario_sistema = Not(currentUserId);
        }
        const usuarioExistente = await this.usuariosRepository.findOne({
            where: whereCondition,
        });

        if (usuarioExistente) {
            throw new ConflictException('El nombre de usuario ya existe');
        }
    }

    async validateExistRoles(rolesIds: number[]): Promise<void> {
        for (const idRol of rolesIds) {
            const existeRol =
                await this.rolesValidationService.validateRolExistsAndActive(
                    idRol,
                );
            if (!existeRol) {
                throw new BadRequestException(
                    `El rol ${idRol} no existe o no está activo`,
                );
            }
        }
    }

    async validateForCreateUsuario(
        createUsuarioDto: CreateUsuarioDto,
    ): Promise<void> {
        await this.validateUserNotExistsByUsername(
            createUsuarioDto.nombre_usuario,
        );
        await this.validateExistRoles(createUsuarioDto.roles);
    }

    async validateForUpdateUsuario(
        updateUsuarioDto: UpdateUsuarioDto,
    ): Promise<UsuariosSistemaEntity> {
        const usuario = await this.validateUserExists(
            updateUsuarioDto.id_usuario_sistema,
        );
        await this.validateUserIsActive(usuario);
        await this.validateUserNotExistsByUsername(
            updateUsuarioDto.nombre_usuario,
            updateUsuarioDto.id_usuario_sistema,
        );
        await this.validateExistRoles(updateUsuarioDto.roles);
        return usuario;
    }

    async validateForDeleteUsuario(
        idUsuarioSistema: number,
    ): Promise<UsuariosSistemaEntity> {
        const usuario = await this.validateUserExists(idUsuarioSistema);
        if (!usuario.activo) {
            throw new BadRequestException(
                'El usuario ya se encuentra inhabilitado',
            );
        }
        return usuario;
    }

    async validateForRestoreUsuario(
        idUsuarioSistema: number,
    ): Promise<UsuariosSistemaEntity> {
        const usuario = await this.validateUserExists(idUsuarioSistema);
        await this.validateUserIsNotActive(usuario);
        return usuario;
    }
}
