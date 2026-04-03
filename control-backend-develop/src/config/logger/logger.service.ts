import { Injectable, Logger } from '@nestjs/common';
import {
    createLogger,
    format,
    transports,
    Logger as WinstonLogger,
} from 'winston';
import { join } from 'path';
import 'winston-daily-rotate-file';
import { IErrorContext } from 'src/shared/interfaces/response.interface';

@Injectable()
export class LoggerService {
    private logger: WinstonLogger;
    private readonly loggerConsole: Logger = new Logger(LoggerService.name);

    constructor() {
        const logDir = join(process.cwd(), 'logs');

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({
                    alias: 'timestamp',
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.errors({ stack: true }),
                format.json({
                    space: 2,
                }),
            ),
            transports: [
                new transports.DailyRotateFile({
                    dirname: logDir,
                    filename: 'error-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    level: 'error',
                }),
                new transports.DailyRotateFile({
                    dirname: logDir,
                    filename: 'combined-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });
    }

    error(
        context: string,
        message: string,
        errorContext: IErrorContext,
        trace?: string,
    ) {
        this.logger.error({
            context,
            message,
            ...errorContext,
            trace,
            timestamp: new Date().toISOString(),
        });

        this.loggerConsole.error(`${message} [${errorContext.traceId}]`);
    }

    warn(context: string, message: string, errorContext: IErrorContext) {
        this.logger.warn({
            context,
            message,
            ...errorContext,
            timestamp: new Date().toISOString(),
        });

        this.loggerConsole.warn(`${message} [${errorContext.traceId}]`);
    }

    info(context: string, message: string) {
        this.logger.info({
            context,
            message,
            timestamp: new Date().toISOString(),
        });

        this.loggerConsole.log(message);
    }

    debug(context: string, message: string) {
        this.logger.debug({
            context,
            message,
            timestamp: new Date().toISOString(),
        });

        this.loggerConsole.debug(message);
    }
}
