import { useStore } from '@nanostores/solid'
import { ParentComponent, createContext, createEffect, createSignal, onCleanup } from 'solid-js'
import { Theme, defaultUIStoreValues, saveUiState, uiStore } from '#/context/stores/ui.store'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: defaultUIStoreValues.theme,
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider: ParentComponent = (props) => {
  const uiState = useStore(uiStore)
  const [theme, setTheme] = createSignal<Theme>(uiState().theme)

  createEffect(() => {
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

    applyTheme(theme())
  })

  const value = {
    theme: theme(),
    setTheme: (newTheme: Theme) => {
      saveUiState({ theme: newTheme })
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>{props.children}</ThemeProviderContext.Provider>
  )
}
