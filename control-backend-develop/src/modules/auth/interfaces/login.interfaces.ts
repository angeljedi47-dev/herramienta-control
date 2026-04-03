import { IGetOperacionesUsuario } from 'src/modules/users/interfaces/usuarios.interface';

export interface IUserLoggedDataToMapper {
    id_usuario_sistema: number;
    nombre_usuario: string;
}

export interface IUserLoggedDataMapped {
    id_usuario_sistema: number;
    nombre_usuario: string;
}

export interface ISignInToMapper {
    token: string;
    permisos: IGetOperacionesUsuario;
    user_data: IUserLoggedDataMapped;
}

export interface ISignInMapped {
    token: string;
    permisos: IGetOperacionesUsuario;
    user_data: IUserLoggedDataMapped;
}

export interface IPayload {
    id: number;
    nombre_usuario: string;
}

export interface IUserAuthenticated extends IPayload {
    operaciones: number[];
}
