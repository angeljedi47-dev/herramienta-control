import { IResponse } from '@/config/axios/interfaces';

export interface IModuloDB {
    nombre_modulo: string;
    operaciones: IOperacionModuloDB[];
}

export interface IOperacionModuloDB {
    id_operacion: number;
    nombre_operacion: string;
}

export interface IModulo {
    nombreModulo: string;
    operaciones: IOperacionModulo[];
}

export interface IOperacionModulo {
    idOperacion: number;
    nombreOperacion: string;
}

export type IReponseModulosWithOperationsDB = IResponse<IModuloDB[]>;
export type IReponseModulosWithOperations = IResponse<IModulo[]>;
