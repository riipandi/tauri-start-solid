import { useStore } from '@nanostores/solid'
import { createEffect, onCleanup } from 'solid-js'
import { themeMode, currentTheme } from '#/stores/settings'

/**
 * Hook to sync theme data attributes to root element
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
export function useTheme() {
  // Bridge nanostores to SolidJS reactivity
  const mode = useStore(themeMode)
  const theme = useStore(currentTheme)

  createEffect(() => {
    const rootElement = document.documentElement || document.body
    rootElement.setAttribute('data-appearance', mode())
    rootElement.setAttribute('data-theme', theme())
  })

  onCleanup(() => {
    const rootElement = document.documentElement || document.body
    rootElement.removeAttribute('data-appearance')
    rootElement.removeAttribute('data-theme')
  })
}
