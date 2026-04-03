import { BadRequestException, Injectable } from '@nestjs/common';
import { OperacionesModulosValidationService } from 'src/modules/modulos/services/operaciones-modulos-validation.service';

@Injectable()
export class RolesOperacionesValidationService {
    constructor(
        private readonly operacionesModulosValidationService: OperacionesModulosValidationService,
    ) {}

    async validateOperacionesExist(idsOperaciones: number[]): Promise<void> {
        if (!idsOperaciones || idsOperaciones.length === 0) {
            return;
        }
        for (const idOperacion of idsOperaciones) {
            const existeOperacion =
                await this.operacionesModulosValidationService.validateExistRolOperacion(
                    idOperacion,
                );
            if (!existeOperacion) {
                throw new BadRequestException(
                    `La operación con ID '${idOperacion}' y no existe.`,
                );
            }
        }
    }
}
