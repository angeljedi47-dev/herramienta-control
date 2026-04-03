import { Injectable } from '@nestjs/common';
import { OperacionesModulosEntity } from '../entities/operaciones-modulos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OperacionesModulosValidationService {
    constructor(
        @InjectRepository(OperacionesModulosEntity)
        private operacionesModulosRepository: Repository<OperacionesModulosEntity>,
    ) {}
    async validateExistRolOperacion(idOperacion: number): Promise<boolean> {
        const rolOperacion = await this.operacionesModulosRepository.findOne({
            where: {
                id_operacion: idOperacion,
            },
        });

        return rolOperacion ? true : false;
    }
}
