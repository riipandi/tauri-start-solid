import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { SettingsProvider } from '#/providers/settings-provider'
import { GlobalNotFound } from '#/routes/-errors'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: GlobalNotFound
})

function RootComponent() {
  return (
    <SettingsProvider>
      <Outlet />
    </SettingsProvider>
  )
}
