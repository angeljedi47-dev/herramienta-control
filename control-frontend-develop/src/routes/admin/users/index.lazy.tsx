import { UsersPage } from '@/modules/users/pages/UsersPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/users/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <UsersPage />;
}
