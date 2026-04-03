import { createLazyFileRoute } from '@tanstack/react-router'
import { PublicProjectsStatus } from '@/modules/projects/components'
import { PublicLayout } from '@/modules/layout/pages/PublicLayout'

export const Route = createLazyFileRoute('/public/status/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PublicLayout>
        <PublicProjectsStatus />
    </PublicLayout>
  );
}
