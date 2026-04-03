import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulosEntity } from 'src/modules/modulos/entities/modulos.entity';
import { IModuloFindAllMapped } from 'src/modules/modulos/interfaces/modulos.interface';
import { ModulosMapper } from 'src/modules/modulos/mappers/modulos.mapper';
import { Repository } from 'typeorm';

@Injectable()
export class ModulosService {
    constructor(
        @InjectRepository(ModulosEntity)
        private modulosRepository: Repository<ModulosEntity>,
    ) {}

    async findAll(): Promise<IModuloFindAllMapped[]> {
        const modulos = await this.modulosRepository.find({
            relations: {
                operaciones_modulos: true,
            },
            select: {
                nombre_modulo: true,
                operaciones_modulos: {
                    id_operacion: true,
                    nombre_operacion: true,
                },
            },
        });

        return modulos.map(ModulosMapper.toModuloMapperFindAll);
    }
}
