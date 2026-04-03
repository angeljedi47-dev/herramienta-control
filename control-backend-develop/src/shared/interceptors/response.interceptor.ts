import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from 'src/shared/interfaces/response.interface';

@Injectable()
export class ResponseTransformInterceptor
    implements NestInterceptor<unknown, IResponse<unknown>>
{
    intercept(
        _: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<unknown>> {
        return next.handle().pipe(
            map((data) => {
                return CustomResponse.buildResponse(data);
            }),
        );
    }
}

export class CustomResponse {
    static buildResponse<T>(response: IResponse<T>): IResponse<T> {
        const { message, ...dataResponse } = response;
        return {
            message: message ? message : 'Datos obtenidos correctamente',
            data: dataResponse.data,
        };
    }
}
