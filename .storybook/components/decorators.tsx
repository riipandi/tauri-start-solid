import { createEffect, onCleanup } from 'solid-js'
import type { Decorator } from 'storybook-solidjs'
import { ThemeProvider } from '#/components/theme/provider'

function setTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme
}

export const withThemeProvider: Decorator = (Story, context) => {
  const theme = context.parameters.theme || context.globals.theme

  createEffect(() => {
    if (theme !== 'system') {
      setTheme(theme)
      return
    }

    const query = window.matchMedia('(prefers-color-scheme: dark)')
    setTheme(query.matches ? 'dark' : 'light')

    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', handleChange)
    onCleanup(() => query.removeEventListener('change', handleChange))
  })

  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  )
}
