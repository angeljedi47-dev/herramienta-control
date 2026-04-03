import { MODULOS_ACCESO } from '@/const/variables_acceso';
import { queryPaginatedGetAllRolesOptions } from '@/modules/roles/queryOptions';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/roles')({
    beforeLoad: ({ context }) => {
        if (
            !context.authenticated ||
            !context.modulos.includes(MODULOS_ACCESO.ROLES)
        ) {
            toast.error('No tienes permisos para acceder a esta página');
            throw redirect({ to: '/admin' });
        }
    },
    loader: async ({ context }) => {
        const roles = await context.queryClient?.ensureQueryData(
            queryPaginatedGetAllRolesOptions({ page: 1, limit: 10 }),
        );
        return roles;
    },
});
