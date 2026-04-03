import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './shared/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UsuariosService } from './modules/users/services/usuarios.service';
import { OperationsGuard } from './modules/auth/guards/operations.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggerService } from './config/logger/logger.service';
import { IValidationError } from './shared/interfaces/response.interface';
import { BaseException } from './shared/exceptions/base.exception';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { EnvsService } from './config/env/services/envs.service';
import { NODE_ENVIROMENTS } from './config/env/interfaces/envs.interface';
import { FileManipulationService } from './config/multer';
import { DateTimeService } from './config/date-time/date-time.service';

async function bootstrap() {
    initializeTransactionalContext();

    const app = await NestFactory.create(AppModule);
    const envService = app.get(EnvsService);
    const serverEnvs = envService.getGroup('SERVER');
    const loggerService = app.get(LoggerService);
    const fileManipulationService = app.get(FileManipulationService);
    const dateTimeService = app.get(DateTimeService);

    app.enableCors();
    app.useGlobalFilters(
        new HttpExceptionFilter(
            loggerService,
            envService,
            fileManipulationService,
            dateTimeService,
        ),
    );

    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (errors) => {
                const validationErrors: IValidationError[] = [];
                errors.forEach((error) => {
                    for (const key in error.constraints) {
                        validationErrors.push({
                            property: error.property,
                            message: error.constraints[key],
                        });
                    }
                });

                return new BaseException({
                    message: 'Error de validación',
                    errors: validationErrors,
                });
            },
            stopAtFirstError: false,
        }),
    );
    app.useGlobalGuards(
        new AuthGuard(
            app.get(JwtService),
            app.get(EnvsService),
            app.get(Reflector),
            app.get(UsuariosService),
        ),
        new OperationsGuard(app.get(Reflector)),
    );

    const config = new DocumentBuilder()
        .setTitle('Documentación de la API')
        .setDescription('Documentación de los endpoints de la API')
        .setVersion('1.0')
        .addTag('api')
        .addBearerAuth()
        .build();
    const pathApi = 'api';

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    if (serverEnvs.ENVIRONMENT === NODE_ENVIROMENTS.DEVELOPMENT) {
        SwaggerModule.setup(pathApi, app, documentFactory, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
    }

    await app.listen(serverEnvs.PORT ?? 3000, serverEnvs.HOST ?? '0.0.0.0');

    const urlServer = await app.getUrl();

    loggerService.debug('main', `Server is running on ${urlServer}`);
    loggerService.debug('main', `Documentation: ${urlServer}/${pathApi}`);
    loggerService.debug('main', `Environment: ${serverEnvs.ENVIRONMENT}`);
}
bootstrap();
