import { ISignInData, ISignInDataDB } from '../interfaces';

export const signInMapper = (signInDataDB: ISignInDataDB): ISignInData => {
    const { token, permisos, user_data: userData } = signInDataDB;
    return {
        token,
        permisos,
        userData: {
            idUsuarioSistema: userData.id_usuario_sistema,
            nombreUsuario: userData.nombre_usuario,
        },
    };
};
