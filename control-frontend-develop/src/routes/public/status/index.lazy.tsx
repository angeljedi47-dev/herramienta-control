import { createLazyFileRoute } from '@tanstack/react-router'
import { PublicProjectsStatus } from '@/modules/projects/components'

export const Route = createLazyFileRoute('/public/status/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PublicProjectsStatus />
}
