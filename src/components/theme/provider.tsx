import { invoke } from '@tauri-apps/api/core'
import { createConsola } from 'consola/basic'
import type { ParentComponent } from 'solid-js'
import { createContext, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { type Theme as AppTheme, commands } from '#/libs/bindings'

export type Theme = AppTheme

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
      const savedTheme = await commands.getTheme()
      log.debug('Theme loaded:', savedTheme)
      if (savedTheme.status === 'ok') {
        setTheme(savedTheme.data)
      }
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
