import type { JSX } from 'solid-js'

interface ThemeProviderProps {
  children: JSX.Element
}

export function ThemeProvider(props: ThemeProviderProps) {
  return props.children
}
