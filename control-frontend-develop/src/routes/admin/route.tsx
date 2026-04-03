import ValidatingAccess from '@/components/loaders/ValidatingAccess';
import { LOCALSTORAGE_KEYS } from '@/const/localstorage.const';
import { validateTokenOptions } from '@/modules/auth/queryOptions';
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin')({
    beforeLoad: async ({ context }) => {
        const token = localStorage.getItem(LOCALSTORAGE_KEYS.TOKEN_AUTH);
        if (token) {
            try {
                const data =
                    await context.queryClient?.ensureQueryData(
                        validateTokenOptions,
                    );
                if (data) {
                    const { permisos, userData } = data.data;
                    context.setPermisos(permisos);
                    context.setAuthenticated(true);
                    context.setUserData(userData);
                    return {
                        authenticated: true,
                        modulos: permisos.modulos,
                    };
                }
            } catch (error) {
                console.log(error);
                if (error instanceof AxiosError) {
                    toast.error(
                        error.response?.data.message ||
                            'Ocurrio un error al iniciar sesión, intente nuevamente',
                    );
                } else {
                    toast.error('Error al validar el token');
                }
                context.setAuthenticated(false);
                localStorage.removeItem(LOCALSTORAGE_KEYS.TOKEN_AUTH);
                throw redirect({ to: '/auth/login' });
            }
        } else {
            toast.error('Inicia sesión para continuar');
            throw redirect({ to: '/auth/login' });
        }
    },
    notFoundComponent: () => {
        return <Navigate to="/admin" />;
    },
    pendingComponent: ValidatingAccess,
});
