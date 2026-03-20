import { useStore } from '@nanostores/solid'
import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { listen } from '@tauri-apps/api/event'
import { onMount, onCleanup, createEffect, Suspense } from 'solid-js'
import { AppLoader } from '#/components/boundaries'
import { ToastProvider } from '#/components/toast'
import { GlobalNotFound } from '#/routes/-errors'
import type { AppSettings } from '#/schemas/settings.schema'
import { themeMode, currentTheme } from '#/stores/settings.store'
import { uiSettings } from '#/stores/settings.store'
import { settingsStore, loadSettings, systemThemeStore } from '#/stores/settings.store'

export const Route = createRootRoute({
  notFoundComponent: GlobalNotFound,
  component: RootComponent
})

/**
 * Sync theme data attributes to root element
 *
 * Updates:
 * - data-appearance: 'auto' | 'dark' | 'light'
 * - data-theme: current active theme name (e.g., 'default-light', 'modern-dark')
 *
 * Example output:
 * <html data-appearance="dark" data-theme="modern-dark">
 * or
 * <body data-appearance="auto" data-theme="default-light">
 */

function RootComponent() {
  const ui = useStore(uiSettings)

  // Bridge nanostores to SolidJS reactivity
  const mode = useStore(themeMode)
  const theme = useStore(currentTheme)

  let unlisten: (() => void) | undefined
  let cleanupSystemThemeListener: (() => void) | undefined

  onMount(async () => {
    const updateSystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      systemThemeStore.set(isDark ? 'dark' : 'light')
    }

    updateSystemTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateSystemTheme)

    cleanupSystemThemeListener = () => {
      mediaQuery.removeEventListener('change', updateSystemTheme)
    }

    // Set up event listener FIRST before loading settings
    unlisten = await listen<AppSettings>('settings://updated', (event) => {
      settingsStore.set(event.payload)
    })

    await loadSettings()
  })

  onCleanup(() => {
    const rootElement = document.documentElement || document.body
    rootElement.removeAttribute('data-appearance')
    rootElement.removeAttribute('data-theme')

    unlisten?.()
    cleanupSystemThemeListener?.()
  })

  createEffect(() => {
    const rootElement = document.documentElement || document.body
    rootElement.setAttribute('data-appearance', mode())
    rootElement.setAttribute('data-theme', theme())
  })

  return (
    <div
      spellcheck={ui().enable_spell_check}
      autocapitalize={!ui().enable_spell_check ? 'none' : undefined}
      aria-autocomplete={!ui().enable_spell_check ? 'none' : undefined}
    >
      <Suspense fallback={<AppLoader />}>
        <Outlet />
      </Suspense>
      <ToastProvider />
    </div>
  )
}
