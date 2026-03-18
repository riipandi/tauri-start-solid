import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { SettingsProvider } from '#/components/settings-provider'
import { TitleBar } from '#/components/title-bar'
import { GlobalNotFound } from '#/routes/-errors'
import * as layoutStyles from '#/styles/layout.css'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: GlobalNotFound
})

function RootComponent() {
  return (
    <SettingsProvider>
      <div class={layoutStyles.appContainer}>
        <TitleBar appTitle='Tauri App' />
        <div class={layoutStyles.appContent}>
          <Outlet />
        </div>
      </div>
    </SettingsProvider>
  )
}
