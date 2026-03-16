import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { GlobalNotFound } from '#/routes/-errors'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: GlobalNotFound
})

function RootComponent() {
  return <Outlet />
}
