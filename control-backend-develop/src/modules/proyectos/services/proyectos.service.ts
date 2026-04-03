import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectosEntity } from '../entities/proyectos.entity';
import { CreateProyectoDto } from '../dtos/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/update-proyecto.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PROYECTOS_PAGINATION_CONFIG } from '../const/proyectos.const';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

@Injectable()
export class ProyectosService {
    constructor(
        @InjectRepository(ProyectosEntity)
        private proyectosRepository: Repository<ProyectosEntity>,
    ) {}

    async findAll(query: PaginateQuery): Promise<Paginated<ProyectosEntity>> {
        const queryBuilder = this.proyectosRepository
            .createQueryBuilder('proyecto')
            .where('proyecto.activo = :activo', { activo: true });

        return paginate(query, queryBuilder, PROYECTOS_PAGINATION_CONFIG);
    }

    async findPublicStatus(): Promise<Partial<ProyectosEntity>[]> {
        return this.proyectosRepository.find({
            select: ['id_proyecto', 'nombre', 'estado', 'tipo', 'fecha_inicio', 'fecha_fin_estimada', 'porcentaje'],
            where: { activo: true },
            order: { fecha_modificacion: 'DESC' },
        });
    }

    async findOne(id: number): Promise<ProyectosEntity> {
        const proyecto = await this.proyectosRepository.findOne({
            where: { id_proyecto: id, activo: true },
        });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
        }

        return proyecto;
    }

    async create(
        createProyectoDto: CreateProyectoDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<ProyectosEntity> {
        const nuevoProyecto = this.proyectosRepository.create({
            ...createProyectoDto,
            id_usuario_creacion: userAuthenticated.id,
        });

        return this.proyectosRepository.save(nuevoProyecto);
    }

    async update(
        id: number,
        updateProyectoDto: UpdateProyectoDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<ProyectosEntity> {
        const proyecto = await this.findOne(id);

        const proyectoActualizado = this.proyectosRepository.merge(proyecto, {
            ...updateProyectoDto,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return this.proyectosRepository.save(proyectoActualizado);
    }

    async delete(
        id: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<boolean> {
        const proyecto = await this.findOne(id);

        await this.proyectosRepository.update(proyecto.id_proyecto, {
            activo: false,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return true;
    }
}
