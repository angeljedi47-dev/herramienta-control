import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/users')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
