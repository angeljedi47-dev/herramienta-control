import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RolesOperacionesEntity } from 'src/modules/roles/entities/roles-operaciones.entity';
import { DateTimeService } from 'src/config/date-time/date-time.service';

@Injectable()
export class RolesOperacionesService {
    constructor(
        @InjectRepository(RolesOperacionesEntity)
        private rolesOperacionesRepository: Repository<RolesOperacionesEntity>,
        private dateTimeService: DateTimeService,
    ) {}

    async findOperacionesByRolId(
        idRol: number,
    ): Promise<RolesOperacionesEntity[]> {
        return this.rolesOperacionesRepository.find({
            where: {
                id_rol: idRol,
                activo: true,
            },
            relations: {
                operacion_modulo: true,
            },
        });
    }

    async desactivarOperacionesDeRol(
        idRol: number,
        idsOperacionesModuloADesactivar: number[],
        idUsuarioEliminacion: number,
    ): Promise<void> {
        if (idsOperacionesModuloADesactivar.length === 0) {
            return;
        }
        const fechaActual = this.dateTimeService.getCurrentDate();
        await this.rolesOperacionesRepository.update(
            {
                id_rol: idRol,
                id_operacion: In(idsOperacionesModuloADesactivar),
                activo: true,
            },
            {
                activo: false,
                fecha_eliminacion: fechaActual,
                id_usuario_eliminacion: idUsuarioEliminacion,
            },
        );
    }

    async activarOcrearOperacionesDeRol(
        idRol: number,
        idsOperacionesModuloACrear: number[],
        idUsuarioCreacion: number,
    ): Promise<void> {
        if (idsOperacionesModuloACrear.length === 0) {
            return;
        }

        const operacionesExistentes =
            await this.rolesOperacionesRepository.find({
                where: {
                    id_rol: idRol,
                    id_operacion: In(idsOperacionesModuloACrear),
                },
                relations: { operacion_modulo: true, rol: true },
                loadRelationIds: false,
            });

        const operacionesParaGuardar: Partial<RolesOperacionesEntity>[] = [];

        for (const idOperacion of idsOperacionesModuloACrear) {
            const existente = operacionesExistentes.find(
                (oe) => oe.operacion_modulo.id_operacion === idOperacion,
            );

            if (existente) {
                if (!existente.activo) {
                    operacionesParaGuardar.push({
                        id_rol_operacion: existente.id_rol_operacion,
                        activo: true,
                        fecha_eliminacion: null,
                        id_usuario_eliminacion: null,
                    });
                }
            } else {
                operacionesParaGuardar.push({
                    id_rol: idRol,
                    id_operacion: idOperacion,
                    activo: true,
                    id_usuario_creacion: idUsuarioCreacion,
                });
            }
        }

        if (operacionesParaGuardar.length > 0) {
            await this.rolesOperacionesRepository.save(operacionesParaGuardar);
        }
    }
}
