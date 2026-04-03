import { createLazyFileRoute } from '@tanstack/react-router';
import ResetPasswordPage from '@/modules/auth/pages/ResetPasswordPage';

export const Route = createLazyFileRoute('/auth/reset-password/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <ResetPasswordPage />;
}
