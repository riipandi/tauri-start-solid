import { listen } from '@tauri-apps/api/event'
import { type JSX, onMount, onCleanup } from 'solid-js'
import { useTheme } from '#/hooks/use-theme'
import type { AppSettings } from '#/schemas/settings.schema'
import { settingsStore, loadSettings, systemThemeStore } from '#/stores/settings'

interface SettingsProviderProps {
  children: JSX.Element
}

export function SettingsProvider(props: SettingsProviderProps) {
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
    unlisten?.()
    cleanupSystemThemeListener?.()
  })

  useTheme()

  const uiSettings = settingsStore.get().ui

  return (
    <div
      spellcheck={uiSettings.enable_spell_check}
      autocapitalize={!uiSettings.enable_spell_check ? 'none' : undefined}
      aria-autocomplete={!uiSettings.enable_spell_check ? 'none' : undefined}
    >
      {props.children}
    </div>
  )
}
