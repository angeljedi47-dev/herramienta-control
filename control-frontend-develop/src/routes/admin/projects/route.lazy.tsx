import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/projects')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Outlet />;
}
