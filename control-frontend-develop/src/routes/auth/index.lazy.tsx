import { createLazyFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Navigate to="/auth/login" />;
}
