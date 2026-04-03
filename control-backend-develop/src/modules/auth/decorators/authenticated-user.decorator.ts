import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IReqCustom } from 'src/shared/interfaces/request.interface';
import { IUserAuthenticated } from 'src/modules/auth/interfaces/login.interfaces';

export const AuthenticatedUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): IUserAuthenticated => {
        const request = ctx.switchToHttp().getRequest<IReqCustom>();
        return request.user_authenticated;
    },
);
