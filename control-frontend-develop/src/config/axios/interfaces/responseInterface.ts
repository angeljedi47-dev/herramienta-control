export interface IResponse<T> {
    message: string;
    data: T;
}

export interface IValidationError {
    property: string;
    message: string;
}

export interface IErrorResponse {
    message: string;
    data: null;
    statusCode: number;
    timestamp: string;
    errors?: IValidationError[];
    traceId: string;
}
