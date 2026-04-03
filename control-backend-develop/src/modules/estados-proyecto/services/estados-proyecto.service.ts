import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadosProyectoEntity } from '../entities/estados-proyecto.entity';
import { CreateEstadoProyectoDto } from '../dtos/create-estado-proyecto.dto';
import { UpdateEstadoProyectoDto } from '../dtos/update-estado-proyecto.dto';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

@Injectable()
export class EstadosProyectoService {
    constructor(
        @InjectRepository(EstadosProyectoEntity)
        private repo: Repository<EstadosProyectoEntity>,
    ) {}

    async findAll(): Promise<EstadosProyectoEntity[]> {
        return this.repo.find({
            where: { activo: true },
            order: { nombre: 'ASC' },
        });
    }

    async findOne(id: number): Promise<EstadosProyectoEntity> {
        const estado = await this.repo.findOne({
            where: { id_estado_proyecto: id, activo: true },
        });

        if (!estado) {
            throw new NotFoundException(`Estado con ID ${id} no encontrado`);
        }
        return estado;
    }

    async create(
        createDto: CreateEstadoProyectoDto,
        user: IUserAuthenticated,
    ): Promise<EstadosProyectoEntity> {
        const nuevo = this.repo.create({
            ...createDto,
            id_usuario_creacion: user.id,
        });
        return this.repo.save(nuevo);
    }

    async update(
        id: number,
        updateDto: UpdateEstadoProyectoDto,
        user: IUserAuthenticated,
    ): Promise<EstadosProyectoEntity> {
        const estado = await this.findOne(id);
        
        const actualizado = this.repo.merge(estado, {
            ...updateDto,
            id_usuario_modificacion: user.id,
        });

        return this.repo.save(actualizado);
    }

    async delete(
        id: number,
        user: IUserAuthenticated,
    ): Promise<boolean> {
        const estado = await this.findOne(id);

        await this.repo.update(estado.id_estado_proyecto, {
            activo: false,
            id_usuario_modificacion: user.id,
        });

        return true;
    }
}
