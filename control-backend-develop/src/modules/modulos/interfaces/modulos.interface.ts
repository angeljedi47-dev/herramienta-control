/* Refactorización nueva */
export interface IModuloFindAllMapped {
    nombre_modulo: string;
    operaciones: {
        id_operacion: number;
        nombre_operacion: string;
    }[];
}
