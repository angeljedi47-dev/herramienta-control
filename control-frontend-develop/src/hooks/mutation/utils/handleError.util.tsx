import { IErrorResponse } from '@/config/axios/interfaces/responseInterface';
import { AxiosError } from 'axios';
import { FieldValues, Path } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

const componentDescription = (err: IErrorResponse) => (
    <div className="flex flex-col space-y-1.5">
        <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Código de seguimiento</span>
        </div>
        <code className="px-2 py-1 bg-background/80 rounded-md text-xs font-mono break-all">
            {err.traceId}
        </code>
    </div>
);

const convertBlobToJson = async (blob: Blob): Promise<IErrorResponse> => {
    try {
        const text = await blob.text();
        return JSON.parse(text);
    } catch (error) {
        console.log(error);
        return {
            message: 'Error al procesar la respuesta del servidor',
            statusCode: 500,
            traceId: 'BLOB_PARSE_ERROR',
            errors: [],
            data: null,
            timestamp: new Date().toISOString(),
        };
    }
};

export const handleError = async <T extends FieldValues>(
    error: unknown,
    form?: UseFormReturn<T>,
    errorMapping?: Record<keyof T, string>,
) => {
    console.log(error);
    if (error instanceof AxiosError) {
        let err: IErrorResponse;

        // Check if the error response is a Blob
        if (error.response?.data instanceof Blob) {
            err = await convertBlobToJson(error.response.data);
        } else {
            err = error.response?.data as IErrorResponse;
        }

        if (err.statusCode >= 500) {
            toast.error(
                'Ocurrio un error inesperado, intentalo de nuevo mas tarde o reporta el código de seguimiento a los administradores del sistema.',
                {
                    description: componentDescription(err),
                },
            );
        } else {
            toast.warning(err.message, {
                description: componentDescription(err),
            });
        }

        if (err.errors && errorMapping && form) {
            err.errors.forEach((error) => {
                const frontendField = Object.entries(errorMapping).find(
                    ([, backendField]) => backendField === error.property,
                )?.[0];

                if (frontendField) {
                    form.setError(frontendField as Path<T>, {
                        message: error.message,
                    });
                }
            });
        }
    } else {
        toast.error(
            'Ocurrio un error inesperado, intentalo de nuevo mas tarde',
        );
    }
};
