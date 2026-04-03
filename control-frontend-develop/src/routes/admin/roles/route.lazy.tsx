import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/roles')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
