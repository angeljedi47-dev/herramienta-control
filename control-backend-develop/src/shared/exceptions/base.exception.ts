import { HttpException, HttpStatus } from '@nestjs/common';
import {
    IValidationError,
    IErrorResponse,
} from '../interfaces/response.interface';
import { randomUUID } from 'crypto';

export interface IBaseExceptionOptions<T = any> {
    message: string;
    statusCode?: number;
    data?: T;
    errors?: IValidationError[];
    timestamp?: string;
}

export class BaseException<T = any> extends HttpException {
    public readonly traceId: string;
    public readonly timestamp: string;
    public readonly data: T | null;
    public readonly errors?: IValidationError[];

    constructor(options: IBaseExceptionOptions<T>) {
        const {
            message,
            statusCode = HttpStatus.BAD_REQUEST,
            data = null,
            errors,
            timestamp,
        } = options;

        super(message, statusCode);

        this.traceId = randomUUID();
        this.timestamp = timestamp || new Date().toISOString();
        this.data = data;
        this.errors = errors;
    }

    getResponse(): IErrorResponse {
        return {
            message: this.message,
            data: this.data,
            statusCode: this.getStatus(),
            timestamp: this.timestamp,
            traceId: this.traceId,
            ...(this.errors && { errors: this.errors }),
        };
    }
}
