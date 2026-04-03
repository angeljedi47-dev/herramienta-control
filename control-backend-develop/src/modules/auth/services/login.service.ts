import { Injectable } from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsuariosService } from '../../users/services/usuarios.service';
import { LoginMapper } from 'src/modules/auth/mappers/login.mapper';
import { IPayload } from '../interfaces/login.interfaces';
import { SigninValidationService } from './signin-validation.service';
import { JwtAppService } from 'src/config/jtw/jwt.service';
import { Transactional } from 'typeorm-transactional';
@Injectable()
export class LoginService {
    constructor(
        private readonly jwtService: JwtAppService,
        private readonly usuariosService: UsuariosService,
        private readonly signinValidationService: SigninValidationService,
    ) {}

    @Transactional()
    async signIn(signInDto: SignInDto) {
        const usuario = await this.signinValidationService.validateSignIn(
            signInDto.nombre_usuario,
            signInDto.password,
        );

        const permisos = await this.usuariosService.obtenerOperacionesUsuario(
            usuario.id_usuario_sistema,
        );

        const payload: IPayload = {
            id: usuario.id_usuario_sistema,
            nombre_usuario: usuario.nombre_usuario,
        };

        const userData = await this.usuariosService.getDataUserLogged(
            usuario.id_usuario_sistema,
        );

        return LoginMapper.toSignInMapped({
            token: await this.jwtService.signAsync(payload),
            permisos,
            user_data: userData,
        });
    }

    async validateToken(token: string) {
        const payloadDecoded =
            await this.jwtService.verifyAsync<IPayload>(token);
        return payloadDecoded;
    }
}
