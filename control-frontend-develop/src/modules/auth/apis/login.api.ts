import {
    ISignInFormDB,
    ISignInResponse,
    IValidateTokenResponse,
    IValidateTokenResponseDB,
    ISignInResponseDB,
} from '../interfaces';
import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import { signInMapper } from '../mappers';
import { api } from '@/config/axios';

export const signIn = async (
    signInDto: ISignInFormDB,
): Promise<ISignInResponse> => {
    const res = await api.post<ISignInResponseDB>('/login', signInDto);
    const signInDataMapped = signInMapper(res.data.data);
    return {
        message: res.data.message,
        data: signInDataMapped,
    };
};

export const validateToken = async (): Promise<IValidateTokenResponse> => {
    const res = await api.get<IValidateTokenResponseDB>(
        '/login/validate-token',
    );
    const signInDataMapped = signInMapper({
        token: localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN_AUTH) || '',
        permisos: res.data.data.permisos,
        user_data: res.data.data.user_data,
    });
    return {
        message: res.data.message,
        data: signInDataMapped,
    };
};
