import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { SettingsProvider } from '#/providers/settings-provider'
import { ThemeProvider } from '#/providers/theme-provider'
import { GlobalNotFound } from '#/routes/-errors'

export const Route = createRootRoute({
  notFoundComponent: GlobalNotFound,
  component: RootComponent
})

function RootComponent() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </SettingsProvider>
  )
}
