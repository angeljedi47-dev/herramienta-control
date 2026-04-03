import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/modules/users/services/usuarios.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SigninValidationService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async validateSignIn(username: string, password: string) {
        const usuario =
            await this.usuariosService.getActiveUserByUserName(username);

        if (!usuario) {
            throw new UnauthorizedException(
                'El usuario o contraseña son incorrectos',
            );
        }

        await this.comparePasswordThrow(password, usuario.password);

        return usuario;
    }

    private async comparePasswordThrow(password: string, password_db: string) {
        const isPasswordValid = await bcrypt.compare(password, password_db);

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'El usuario o contraseña son incorrectos',
            );
        }
    }
}
