import { Controller, Post, Body, Get } from '@nestjs/common';
import { LoginService } from '../services/login.service';
import { SignInDto } from '../dtos/signin.dto';
import { CustomResponse } from 'src/shared/interceptors/response.interceptor';
import { UsuariosService } from 'src/modules/users/services/usuarios.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IUserAuthenticated } from '../interfaces/login.interfaces';
import { AuthenticatedUser } from '../decorators/authenticated-user.decorator';

@Controller('login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        private readonly usuariosService: UsuariosService,
    ) {}

    @ApiOperation({
        summary: 'Iniciar sesión',
        responses: {
            200: { description: 'Usuario logueado correctamente' },
        },
    })
    @Public()
    @Post()
    async signIn(@Body() signInDto: SignInDto) {
        return CustomResponse.buildResponse({
            message: 'Usuario logueado correctamente',
            data: await this.loginService.signIn(signInDto),
        });
    }

    @ApiOperation({
        summary: 'Validar token',
        description: 'Valida el token de autenticación en el inicio de sesión',
        responses: {
            200: { description: 'Token válido' },
        },
    })
    @ApiBearerAuth()
    @Get('validate-token')
    async validateToken(
        @AuthenticatedUser() userAuthenticated: IUserAuthenticated,
    ) {
        const permisos = await this.usuariosService.obtenerOperacionesUsuario(
            userAuthenticated.id,
        );

        const userDataLogged = await this.usuariosService.getDataUserLogged(
            userAuthenticated.id,
        );

        return CustomResponse.buildResponse({
            message: 'Token válido',
            data: {
                permisos,
                user_data: userDataLogged,
            },
        });
    }
}
