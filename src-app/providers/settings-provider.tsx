import { listen } from '@tauri-apps/api/event'
import { type JSX, onMount, onCleanup } from 'solid-js'
import { useThemeAttributes } from '#/hooks/use-theme'
import { settingsStore, loadSettings } from '#/stores/settings'
import type { AppSettings } from '#/types/settings'

interface SettingsProviderProps {
  children: JSX.Element
}

export function SettingsProvider(props: SettingsProviderProps) {
  let unlisten: (() => void) | undefined

  onMount(async () => {
    console.log('[SettingsProvider] onMount() - Loading initial settings')

    // CRITICAL: Set up event listener FIRST before loading settings
    console.log('[SettingsProvider] Setting up event listener for settings://updated')
    unlisten = await listen<AppSettings>('settings://updated', (event) => {
      console.log('[SettingsProvider] ✅ Event received: settings://updated')
      console.log('[SettingsProvider] Event payload:', event.payload)
      console.log('[SettingsProvider] Store state BEFORE update:', settingsStore.get())

      settingsStore.set(event.payload)

      console.log('[SettingsProvider] Store state AFTER update:', settingsStore.get())
    })
    console.log('[SettingsProvider] Event listener registered successfully')

    // Now load initial settings
    await loadSettings()
    console.log('[SettingsProvider] Initial settings loaded')
  })

  onCleanup(() => {
    console.log('[SettingsProvider] onCleanup() - Cleaning up')
    unlisten?.()
  })

  useThemeAttributes()

  console.log('[SettingsProvider] Theme attributes hook initialized')
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
