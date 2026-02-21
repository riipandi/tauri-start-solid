import { useContext } from 'solid-js'
import { ThemeProviderContext } from '#/components/theme/provider'

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
