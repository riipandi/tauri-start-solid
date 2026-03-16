import { createFileRoute, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/(primary)')({
  component: RouteComponent
})

function RouteComponent() {
  return <Outlet />
}
