import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/reset-password')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
