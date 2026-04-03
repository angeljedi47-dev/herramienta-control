import * as React from 'react';
import {
    Navigate,
    Outlet,
    createRootRouteWithContext,
} from '@tanstack/react-router';
import { toast } from 'sonner';
import { env } from '@/config/env';
import { IRouteContext } from '@/config/router/context';

const TanStackRouterDevtools =
    env.VITE_NODE_ENV === 'production' || env.VITE_NODE_ENV === 'staging'
        ? () => null // Render nothing in production
        : React.lazy(() =>
              // Lazy load in development
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools,
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              })),
          );

export const Route = createRootRouteWithContext<IRouteContext>()({
    component: () => <RootComponent />,
    notFoundComponent: () => {
        toast.error('No existe la pagina especificada');
        return <Navigate to="/auth/login" replace />;
    },
});

function RootComponent() {
    return (
        <React.Fragment>
            <Outlet />
            <React.Suspense>
                <TanStackRouterDevtools />
            </React.Suspense>
        </React.Fragment>
    );
}
