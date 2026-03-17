import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { SettingsProvider } from '#/components/settings-provider'
import { GlobalNotFound } from '#/routes/-errors'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: GlobalNotFound
})

function RootComponent() {
  return (
    <SettingsProvider>
      <div spellcheck={false} autocapitalize='none' aria-autocomplete='none'>
        <Outlet />
      </div>
    </SettingsProvider>
  )
}
