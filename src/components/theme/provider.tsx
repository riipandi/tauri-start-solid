import type { MaybeConfigColorMode } from '@kobalte/core/color-mode'
import { invoke } from '@tauri-apps/api/core'
import { createConsola } from 'consola/basic'
import type { ParentComponent } from 'solid-js'
import { createContext, createEffect, createSignal, onCleanup, onMount } from 'solid-js'

export type Theme = MaybeConfigColorMode

type ThemeProviderState = {
  theme: () => Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: () => 'system',
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider: ParentComponent = (props) => {
  const log = createConsola({ defaults: { tag: 'theme-provider' } })
  const [theme, setTheme] = createSignal<Theme>('system')
  const [isLoaded, setIsLoaded] = createSignal(false)

  onMount(async () => {
    try {
      const savedTheme = await invoke<Theme>('get_theme')
      log.debug('Theme loaded:', savedTheme)
      setTheme(savedTheme)
    } catch (error) {
      log.error('Failed to get theme:', error)
    } finally {
      setIsLoaded(true)
    }
  })

  createEffect(() => {
    const currentTheme = theme()
    const root = document.documentElement

    function applyTheme(selectedTheme: Theme) {
      if (selectedTheme !== 'system') {
        root.dataset.theme = selectedTheme
        return
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      root.dataset.theme = mediaQuery.matches ? 'dark' : 'light'

      function handleChange(event: MediaQueryListEvent) {
        root.dataset.theme = event.matches ? 'dark' : 'light'
      }

      mediaQuery.addEventListener('change', handleChange)
      onCleanup(() => mediaQuery.removeEventListener('change', handleChange))
    }

    applyTheme(currentTheme)
  })

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      invoke('set_theme', { theme: newTheme })
        .then(() => setTheme(newTheme))
        .catch((error) => log.error('Failed to set theme:', error))
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {isLoaded() && props.children}
    </ThemeProviderContext.Provider>
  )
}
