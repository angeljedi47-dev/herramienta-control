import { MODULOS_ACCESO } from '@/const/variables_acceso';
import { queryPaginatedGetAllProjectsOptions } from '@/modules/projects/queryOptions';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/projects')({
    beforeLoad: ({ context }) => {
        if (!context.authenticated) {
            toast.error('No tienes permisos para acceder a esta página');
            throw redirect({ to: '/admin' });
        }
        // When MODULOS_ACCESO.PROJECTS is defined, add the validation
        // if (!context.modulos.includes(MODULOS_ACCESO.PROJECTS)) {
        //     toast.error('No tienes permisos para acceder a esta página');
        //     throw redirect({ to: '/admin' });
        // }
    },
    loader: async ({ context }) => {
        const projects = await context.queryClient?.ensureQueryData(
            queryPaginatedGetAllProjectsOptions({ page: 1, limit: 10 }),
        );
        return projects;
    },
});
