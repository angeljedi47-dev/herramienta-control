import { createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import { defaultRouteContext } from './context';

export const router = createRouter({
    routeTree,
    context: defaultRouteContext,
});

declare module '@tanstack/react-router' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}
