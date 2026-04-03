import {
    RouterProvider as TanStackRouterProvider,
    RouteComponent,
    ErrorRouteComponent,
} from '@tanstack/react-router';
import { router } from './router';
import { IRouteContext } from './context';

interface IAppRouterProps {
    context: IRouteContext;
    pendingComponent?: RouteComponent;
    errorComponent?: ErrorRouteComponent;
}

export function AppRouter({
    context,
    pendingComponent,
    errorComponent,
}: IAppRouterProps) {
    return (
        <TanStackRouterProvider
            router={router}
            context={context}
            defaultPendingMs={0}
            defaultGcTime={0}
            defaultStaleTime={0}
            defaultPendingMinMs={0}
            defaultViewTransition={{
                types: ['fade'],
            }}
            defaultPendingComponent={pendingComponent}
            defaultErrorComponent={errorComponent}
        />
    );
}
