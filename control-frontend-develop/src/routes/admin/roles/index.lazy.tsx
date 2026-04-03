import RolesPage from '@/modules/roles/pages/RolesPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/roles/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <RolesPage />;
}
