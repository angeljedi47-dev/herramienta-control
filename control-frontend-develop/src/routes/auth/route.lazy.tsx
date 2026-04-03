import { createLazyFileRoute } from '@tanstack/react-router';
import AuthLayout from '@/modules/layout/pages/AuthLayout';

export const Route = createLazyFileRoute('/auth')({
    component: RouteComponent,
});

function RouteComponent() {
    return <AuthLayout />;
}
