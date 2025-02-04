import { useContext } from 'solid-js'
import { ThemeProviderContext } from '#/components/theme/provider'

export function useTheme() {
  const ctx = useContext(ThemeProviderContext)

  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return ctx
}
