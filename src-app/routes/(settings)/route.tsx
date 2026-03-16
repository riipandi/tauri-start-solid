import { createFileRoute, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/(settings)')({
  component: RouteComponent
})

function RouteComponent() {
  return <Outlet />
}
