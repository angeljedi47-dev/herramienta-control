import { IResponse } from '@/config/axios/interfaces';

export interface ILoginStore {
    permisos: IPermisos;
    authenticated: boolean;
    userData: IDataUserLoggedMapped;
    setAuthenticated: (authenticated: boolean) => void;
    setPermisos: (permisos: IPermisos) => void;
    resetStore: () => void;
    setUserData: (userData: IDataUserLoggedMapped) => void;
}

export interface IDataUserLoggedDB {
    id_usuario_sistema: number;
    nombre_usuario: string;
}

export interface IDataUserLoggedMapped {
    idUsuarioSistema: number;
    nombreUsuario: string;
}
export interface IPermisos {
    modulos: number[];
    operaciones: number[];
}

export interface IPermisosDB {
    modulos: number[];
    operaciones: number[];
}

export interface ISignInDataDB {
    token: string;
    permisos: IPermisosDB;
    user_data: IDataUserLoggedDB;
}

export interface ISignInData {
    token: string;
    permisos: IPermisos;
    userData: IDataUserLoggedMapped;
}

export type ISignInResponseDB = IResponse<ISignInDataDB>;

export type ISignInResponse = IResponse<ISignInData>;

export interface ISignInFormDB {
    nombre_usuario: string;
    password: string;
}

export interface IValidateTokenDB {
    permisos: IPermisosDB;
    user_data: IDataUserLoggedDB;
}

export interface IValidateTokenMapped {
    permisos: IPermisos;
    userData: IDataUserLoggedMapped;
}

export type IValidateTokenResponseDB = IResponse<IValidateTokenDB>;
export type IValidateTokenResponse = IResponse<IValidateTokenMapped>;
