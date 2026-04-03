import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
    REQUIRED_OPERATIONS_KEY,
    OperationRequirement,
} from 'src/modules/auth/decorators/require-operations.decorator';
import { IReqCustom } from 'src/shared/interfaces/request.interface';

@Injectable()
export class OperationsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requirement =
            this.reflector.getAllAndOverride<OperationRequirement>(
                REQUIRED_OPERATIONS_KEY,
                [context.getHandler(), context.getClass()],
            );

        if (!requirement) {
            return true;
        }

        const request = context.switchToHttp().getRequest<IReqCustom>();
        const userOperations = request.user_authenticated?.operaciones || [];

        if (requirement.allOf) {
            const hasAllRequired = requirement.allOf.every((op) =>
                userOperations.includes(op),
            );
            if (!hasAllRequired) {
                throw new ForbiddenException(
                    'No tiene todas las operaciones requeridas para esta acción',
                );
            }
        }

        if (requirement.anyOf) {
            const hasAnyRequired = requirement.anyOf.some((op) =>
                userOperations.includes(op),
            );
            if (!hasAnyRequired) {
                throw new ForbiddenException(
                    'No tiene ninguna de las operaciones requeridas para esta acción',
                );
            }
        }

        return true;
    }
}
