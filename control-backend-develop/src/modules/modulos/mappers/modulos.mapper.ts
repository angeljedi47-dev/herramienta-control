import { ModulosEntity } from 'src/modules/modulos/entities/modulos.entity';
import { IModuloFindAllMapped } from 'src/modules/modulos/interfaces/modulos.interface';

export class ModulosMapper {
    static toModuloMapperFindAll(modulo: ModulosEntity): IModuloFindAllMapped {
        return {
            nombre_modulo: modulo.nombre_modulo,
            operaciones: modulo.operaciones_modulos.map((operacion) => ({
                id_operacion: operacion.id_operacion,
                nombre_operacion: operacion.nombre_operacion,
            })),
        };
    }
}
