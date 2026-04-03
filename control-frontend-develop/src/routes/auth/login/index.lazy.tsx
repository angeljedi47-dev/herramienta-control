import LoginPage from '@/modules/auth/pages/LoginPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/auth/login/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <LoginPage />;
}
