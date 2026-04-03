import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvsService } from 'src/config/env/services/envs.service';
import { IReqCustom } from 'src/shared/interfaces/request.interface';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';
import { UsuariosService } from 'src/modules/users/services/usuarios.service';
import { IPayload } from 'src/modules/auth/interfaces/login.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private envsService: EnvsService,
        private reflector: Reflector,
        private usuariosService: UsuariosService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest<IReqCustom>();
        const token = this.extractTokenFromHeader(request);
        const secret = this.envsService.getGroup('SERVER').JWT_SECRET;
        if (!token) {
            throw new UnauthorizedException('No se ha proporcionado un token');
        }
        try {
            const payload: IPayload = await this.jwtService.verifyAsync(token, {
                secret: secret,
            });

            const permisos =
                await this.usuariosService.obtenerOperacionesUsuario(
                    payload.id,
                );

            request.user_authenticated = {
                ...payload,
                operaciones: permisos.operaciones,
            };
        } catch {
            throw new UnauthorizedException('Token inválido');
        }
        return true;
    }

    private extractTokenFromHeader(request: IReqCustom): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
