import { AdminLayout } from '@/modules/layout/pages/AdminLayout';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin')({
    component: RouteComponent,
});

function RouteComponent() {
    return <AdminLayout />;
}
