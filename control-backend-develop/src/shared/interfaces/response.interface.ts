export interface IResponse<T> {
    message: string;
    data: T;
}

export interface IValidationError {
    property: string;
    message: string;
}

export interface IErrorContext {
    path: string;
    method: string;
    traceId: string;
    errors?: IValidationError[];
    user_logged?: number;
    user_operaciones?: number[];
    hostname?: string;
    environment?: string;
    service_name?: string;
    ip_address?: string;
    user_agent?: string;
    origin?: string;
    referer?: string;
    request_body?: any;
    request_query?: any;
    request_params?: any;
    process_memory_usage?: number;
    request_duration?: number;
    app_version?: string;
    node_version?: string;
}

export interface IErrorResponse<T = any> {
    message: string;
    data: T | null;
    statusCode: number;
    timestamp: string;
    traceId: string;
    errors?: IValidationError[];
}
