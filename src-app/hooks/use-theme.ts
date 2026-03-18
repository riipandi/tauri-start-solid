import { consola } from 'consola'
import { createEffect, onCleanup } from 'solid-js'
import { themeMode, currentTheme } from '#/stores/settings'

/**
 * Hook to sync theme data attributes to root element
 *
 * Updates:
 * - data-appearance: 'auto' | 'dark' | 'light'
 * - data-theme: current active theme name (e.g., 'monokai', 'defaultDark')
 *
 * Example output:
 * <html data-appearance="dark" data-theme="monokai">
 * or
 * <body data-appearance="auto" data-theme="defaultDark">
 */
export function useThemeAttributes() {
  createEffect(() => {
    const mode = themeMode.get()
    const theme = currentTheme.get()

    const rootElement = document.documentElement || document.body

    rootElement.setAttribute('data-appearance', mode)
    rootElement.setAttribute('data-theme', theme)

    if (import.meta.env.DEV) {
      consola.log('[useThemeAttributes]', {
        'data-appearance': mode,
        'data-theme': theme
      })
    }
  })

  onCleanup(() => {
    const rootElement = document.documentElement || document.body
    rootElement.removeAttribute('data-appearance')
    rootElement.removeAttribute('data-theme')

    if (import.meta.env.DEV) {
      consola.log('[useThemeAttributes] Cleaned up attributes')
    }
  })
}
