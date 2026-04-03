import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../config/logger/logger.service';
import { BaseException } from '../exceptions/base.exception';
import {
    IErrorResponse,
    IErrorContext,
} from '../interfaces/response.interface';
import { randomUUID } from 'crypto';
import { IReqCustom } from '../interfaces/request.interface';
import { EnvsService } from '../../config/env/services/envs.service';
import {
    sanitizeData,
    sanitizeHeaders,
} from '../../config/logger/utils/sanitize.util';
import { FileManipulationService } from '../../config/multer/services/file-manipulation.service';
import { DateTimeService } from '../../config/date-time/date-time.service';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: LoggerService,
        private readonly envsService: EnvsService,
        private readonly fileManipulationService: FileManipulationService,
        private readonly dateTimeService: DateTimeService,
    ) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<IReqCustom>();
        const traceId = randomUUID();

        // Limpiar archivos temporales si existen
        this.cleanTemporaryFiles(request);

        const errorResponse = this.buildErrorResponse(exception, traceId);
        const errorContext = this.buildErrorContext(request, errorResponse);

        this.logError(exception, errorResponse, errorContext);

        response.status(errorResponse.statusCode).json(errorResponse);
    }

    /**
     * Elimina los archivos temporales que quedaron en la carpeta temp
     * y los archivos que ya se movieron a la carpeta final
     * @param request Solicitud con las rutas de archivos
     */
    private cleanTemporaryFiles(request: IReqCustom): void {
        try {
            const temporaryFiles: Express.Multer.File[] = [];

            // Caso 1: Archivo único (FileInterceptor)
            const singleFile = request.file as Express.Multer.File | undefined;
            if (singleFile) {
                temporaryFiles.push(singleFile);
            }

            // Caso 2: Múltiples archivos (FilesInterceptor)
            const multipleFiles = request.files as
                | Express.Multer.File[]
                | undefined;
            if (Array.isArray(multipleFiles)) {
                temporaryFiles.push(...multipleFiles);
            }

            // Caso 3: Múltiples campos (FileFieldsInterceptor)
            const fieldsFiles = request.files as
                | { [fieldname: string]: Express.Multer.File[] }
                | undefined;
            if (
                fieldsFiles &&
                typeof fieldsFiles === 'object' &&
                !Array.isArray(fieldsFiles)
            ) {
                Object.values(fieldsFiles).forEach((files) => {
                    if (Array.isArray(files)) {
                        temporaryFiles.push(...files);
                    }
                });
            }

            // Eliminar archivos temporales
            for (const file of temporaryFiles) {
                if (file && file.filename) {
                    if (
                        this.fileManipulationService.deleteFileFromTemp(
                            file.filename,
                        )
                    ) {
                        this.logger.debug(
                            'FileCleanup',
                            `Archivo temporal eliminado: ${file.filename}`,
                        );
                    }
                }
            }

            // Eliminar archivos que ya se movieron a la carpeta final (rollback)
            if (request.files_moved_final?.length > 0) {
                for (const filePath of request.files_moved_final) {
                    if (
                        this.fileManipulationService.deleteFileFromFinal(
                            filePath,
                        )
                    ) {
                        this.logger.debug(
                            'FileCleanup',
                            `Archivo final eliminado: ${filePath}`,
                        );
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                'FileCleanup',
                'Error al eliminar archivos',
                undefined,
                error instanceof Error ? error.stack : undefined,
            );
        }
    }

    private buildErrorResponse(
        exception: unknown,
        traceId: string,
    ): IErrorResponse {
        if (exception instanceof BaseException) {
            return exception.getResponse();
        }

        if (exception instanceof HttpException) {
            return this.buildHttpExceptionResponse(exception, traceId);
        }

        return this.buildInternalServerErrorResponse(traceId);
    }

    private buildHttpExceptionResponse(
        exception: HttpException,
        traceId: string,
    ): IErrorResponse {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        const message = this.extractErrorMessage(exceptionResponse);

        return {
            message,
            data: null,
            statusCode: status,
            timestamp: this.dateTimeService.getCurrentDate().toISOString(),
            traceId,
        };
    }

    private extractErrorMessage(exceptionResponse: string | object): string {
        if (typeof exceptionResponse === 'string') {
            return exceptionResponse;
        }

        if (
            typeof exceptionResponse === 'object' &&
            'message' in exceptionResponse
        ) {
            return Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message[0]
                : (exceptionResponse.message as string);
        }

        return 'Ocurrio un error inesperado, por favor intente nuevamente';
    }

    private buildInternalServerErrorResponse(traceId: string): IErrorResponse {
        return {
            message: 'Error interno del servidor',
            data: null,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: this.dateTimeService.getCurrentDate().toISOString(),
            traceId,
        };
    }

    private buildErrorContext(
        request: IReqCustom,
        errorResponse: IErrorResponse,
    ): IErrorContext {
        const startTime = process.hrtime();
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const duration = seconds * 1000 + nanoseconds / 1000000;
        const serverEnvs = this.envsService.getGroup('SERVER');

        const sanitizedBody = sanitizeData(request.body);
        const sanitizedQuery = sanitizeData(request.query);
        const sanitizedParams = sanitizeData(request.params);
        const sanitizedHeaders = sanitizeHeaders(request.headers);

        return {
            path: request.url,
            method: request.method,
            traceId: errorResponse.traceId,
            errors: errorResponse.errors,
            user_logged: request.user_authenticated?.id,
            user_operaciones: request.user_authenticated?.operaciones,
            hostname: String(request.hostname),
            environment: serverEnvs.ENVIRONMENT,
            service_name: serverEnvs.SERVICE_NAME,
            ip_address: request.ip.includes('::ffff:')
                ? String(request.ip.split('::ffff:')[1])
                : request.ip,
            user_agent: sanitizedHeaders['user-agent'],
            origin: sanitizedHeaders.origin,
            referer: sanitizedHeaders.referer,
            request_body: sanitizedBody,
            request_query: sanitizedQuery,
            request_params: sanitizedParams,
            process_memory_usage: process.memoryUsage().heapUsed,
            request_duration: duration,
            app_version: process.env.npm_package_version || '1.0.0',
            node_version: process.version,
        };
    }

    private logError(
        exception: unknown,
        errorResponse: IErrorResponse,
        errorContext: IErrorContext,
    ): void {
        if (errorResponse.statusCode >= 500) {
            this.logger.error(
                'HttpException',
                errorResponse.message,
                errorContext,
                exception instanceof Error ? exception.stack : undefined,
            );
        } else {
            this.logger.warn(
                'HttpException',
                errorResponse.message,
                errorContext,
            );
        }
    }
}
