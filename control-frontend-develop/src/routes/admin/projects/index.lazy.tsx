import { ProjectsPage } from '@/modules/projects/pages';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/admin/projects/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <ProjectsPage />;
}
