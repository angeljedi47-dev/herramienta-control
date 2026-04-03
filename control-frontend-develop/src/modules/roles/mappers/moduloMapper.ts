import { IModulo, IModuloDB } from '../interfaces';

export const moduloMapper = (modulo: IModuloDB): IModulo => {
    const { nombre_modulo: nombreModulo, operaciones } = modulo;
    return {
        nombreModulo,
        operaciones: operaciones.map((operacion) => ({
            idOperacion: operacion.id_operacion,
            nombreOperacion: operacion.nombre_operacion,
        })),
    };
};
