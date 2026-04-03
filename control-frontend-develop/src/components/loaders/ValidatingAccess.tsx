import {
    Shield,
    Clock,
    RefreshCw,
    AlertTriangle,
    X,
    LogIn,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const ValidatingAccess = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        { text: 'Verificando tu acceso...', time: 0 },
        { text: 'Comprobando tus credenciales...', time: 2000 },
        { text: 'Revisando tus permisos...', time: 5000 },
        { text: 'Esto está tardando más de lo normal', time: 12000 },
        { text: 'Parece que hay un problema de conexión', time: 20000 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentMessage = messages.findIndex(
            (msg) => elapsedTime >= msg.time,
        );
        setMessageIndex(Math.max(currentMessage, 0));
    }, [elapsedTime]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds} segundos`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minuto${minutes > 1 ? 's' : ''} ${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
    };

    const currentMessage = messages[messageIndex];
    const isLongWait = elapsedTime > 12000;
    const isExcessiveWait = elapsedTime > 25000;

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoToLogin = () => {
        window.location.href = '/login';
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="flex items-center justify-center min-h-[300px] w-full">
            <div className="flex flex-col items-center gap-6 p-8 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm max-w-md">
                {/* Icono principal de validación */}
                <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary via-secondary to-neutral p-[3px] animate-spin">
                        <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    {/* Indicadores de estado */}
                    <div className="absolute -top-2 -right-2 h-4 w-4 bg-secondary rounded-full animate-pulse" />
                    <div className="absolute -bottom-2 -left-2 h-3 w-3 bg-neutral rounded-full animate-pulse delay-300" />
                </div>

                {/* Texto principal con retroalimentación temporal */}
                <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                        {currentMessage.text}
                    </h3>

                    {/* Indicador de tiempo */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                            Han pasado{' '}
                            {formatTime(Math.floor(elapsedTime / 1000))}
                        </span>
                    </div>

                    {/* Mensaje adicional para tiempos largos */}
                    {isLongWait && (
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Validación lenta</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                {isExcessiveWait
                                    ? 'El servidor de autenticación parece estar ocupado. Puedes intentar recargar o volver al login.'
                                    : 'La verificación está tomando más tiempo del esperado...'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Barra de progreso con indicador de tiempo */}
                <div className="w-full space-y-2">
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary via-secondary to-neutral rounded-full transition-all duration-1000"
                            style={{
                                width: `${Math.min((elapsedTime / 25000) * 100, 100)}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Botones de acción para tiempos excesivos */}
                {isExcessiveWait && (
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Intentar de nuevo
                            </button>
                            <button
                                onClick={handleGoToLogin}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary rounded-md hover:bg-secondary/90 transition-colors"
                            >
                                <LogIn className="h-4 w-4" />
                                Ir al login
                            </button>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
                        >
                            <X className="h-4 w-4" />
                            Volver atrás
                        </button>
                    </div>
                )}

                {/* Mensaje de seguridad */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                        Por tu seguridad, esta verificación es necesaria
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ValidatingAccess;
