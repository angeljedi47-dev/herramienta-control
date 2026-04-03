import {
    ISignInToMapper,
    ISignInMapped,
} from 'src/modules/auth/interfaces/login.interfaces';

export class LoginMapper {
    static toSignInMapped(signInToMapper: ISignInToMapper): ISignInMapped {
        return {
            token: signInToMapper.token,
            permisos: signInToMapper.permisos,
            user_data: signInToMapper.user_data,
        };
    }
}
