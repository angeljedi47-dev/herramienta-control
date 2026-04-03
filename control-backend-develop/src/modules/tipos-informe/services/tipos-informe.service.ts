import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiposInformeEntity } from '../entities/tipos-informe.entity';
import { CreateTipoInformeDto } from '../dtos/create-tipo-informe.dto';
import { UpdateTipoInformeDto } from '../dtos/update-tipo-informe.dto';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

@Injectable()
export class TiposInformeService {
    constructor(
        @InjectRepository(TiposInformeEntity)
        private tiposInformeRepository: Repository<TiposInformeEntity>,
    ) {}

    async findAll(): Promise<TiposInformeEntity[]> {
        return this.tiposInformeRepository.find({
            where: { activo: true },
            order: { nombre: 'ASC' },
        });
    }

    async findPublicStatus(slug: string): Promise<TiposInformeEntity> {
        const tipoInforme = await this.tiposInformeRepository.findOne({
            where: { slug, activo: true },
            relations: ['proyectos'],
        });
        if (!tipoInforme) {
            throw new NotFoundException(`Tipo de informe no encontrado o inactivo`);
        }
        
        // Filtrar y ordenar los proyectos si es necesario.
        tipoInforme.proyectos = tipoInforme.proyectos.filter(p => p.activo).sort((a, b) => b.fecha_modificacion.getTime() - a.fecha_modificacion.getTime());
        return tipoInforme;
    }

    async findOne(id: number): Promise<TiposInformeEntity> {
        const tipoInforme = await this.tiposInformeRepository.findOne({
            where: { id_tipo_informe: id, activo: true },
        });

        if (!tipoInforme) {
            throw new NotFoundException(`Tipo de informe con ID ${id} no encontrado`);
        }
        return tipoInforme;
    }

    async create(
        createDto: CreateTipoInformeDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<TiposInformeEntity> {
        const exists = await this.tiposInformeRepository.findOne({ where: { slug: createDto.slug, activo: true } });
        if (exists) {
            throw new ConflictException(`El slug ${createDto.slug} ya está en uso.`);
        }
        const nuevo = this.tiposInformeRepository.create({
            ...createDto,
            id_usuario_creacion: userAuthenticated.id,
        });
        return this.tiposInformeRepository.save(nuevo);
    }

    async update(
        id: number,
        updateDto: UpdateTipoInformeDto,
        userAuthenticated: IUserAuthenticated,
    ): Promise<TiposInformeEntity> {
        const tipo = await this.findOne(id);
        
        if (updateDto.slug && updateDto.slug !== tipo.slug) {
            const exists = await this.tiposInformeRepository.findOne({ where: { slug: updateDto.slug, activo: true } });
            if (exists) {
                throw new ConflictException(`El slug ${updateDto.slug} ya está en uso.`);
            }
        }

        const actualizado = this.tiposInformeRepository.merge(tipo, {
            ...updateDto,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return this.tiposInformeRepository.save(actualizado);
    }

    async delete(
        id: number,
        userAuthenticated: IUserAuthenticated,
    ): Promise<boolean> {
        const tipo = await this.findOne(id);

        await this.tiposInformeRepository.update(tipo.id_tipo_informe, {
            activo: false,
            id_usuario_modificacion: userAuthenticated.id,
        });

        return true;
    }
}
