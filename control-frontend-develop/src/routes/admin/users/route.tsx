import { MODULOS_ACCESO } from '@/const/variables_acceso';
import { paginateAllUserOptions } from '@/modules/users/queryOptions';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/users')({
    beforeLoad: ({ context }) => {
        if (
            !context.authenticated ||
            !context.modulos.includes(MODULOS_ACCESO.USUARIOS)
        ) {
            toast.error('No tienes permisos para acceder a esta página');
            throw redirect({ to: '/admin' });
        }
    },
    loader: async ({ context }) => {
        const users = await context.queryClient?.ensureQueryData(
            await paginateAllUserOptions({ page: 1, limit: 10 }),
        );
        return users;
    },
});
