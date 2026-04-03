import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface IErrorComponentRouteProps {
    error: Error;
}

const ErrorComponentRoute = ({ error }: IErrorComponentRouteProps) => {
    const router = useRouter();
    const queryErrorResetBoundary = useQueryErrorResetBoundary();

    useEffect(() => {
        queryErrorResetBoundary.reset();
        console.error('Error capturado:', error);
    }, [queryErrorResetBoundary, error]);

    // Procesar el stack trace para destacar errores del código del proyecto
    const formattedStack = useMemo(() => {
        if (!error.stack) return null;

        return error.stack.split('\n').map((line, index) => {
            const isProjectCode = line.includes('/src/');
            return (
                <p
                    key={index}
                    className={`text-xs ${
                        isProjectCode
                            ? 'text-red-800 font-bold'
                            : 'text-gray-600'
                    }`}
                >
                    {line}
                </p>
            );
        });
    }, [error.stack]);

    return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-red-600 animate-bounce" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    ¡Ups! Ocurrió un error
                </h2>

                <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                    <p className="text-red-600 font-semibold text-sm">
                        {error.name}: {error.message || 'Error desconocido'}
                    </p>

                    <div className="max-h-[200px] overflow-auto mt-2 border-l-4 border-red-400 pl-2">
                        {formattedStack}
                    </div>
                </div>

                <Button onClick={() => router.invalidate()}>
                    <RefreshCcw className="h-5 w-5" />
                    Reintentar
                </Button>
            </div>
        </div>
    );
};

export default ErrorComponentRoute;
