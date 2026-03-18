import { listen } from '@tauri-apps/api/event'
import { consola } from 'consola'
import { type JSX, onMount, onCleanup } from 'solid-js'
import { useThemeAttributes } from '#/hooks/use-theme'
import { settingsStore, loadSettings, initSystemThemeListener } from '#/stores/settings'
import type { AppSettings } from '#/types/settings'

interface SettingsProviderProps {
  children: JSX.Element
}

export function SettingsProvider(props: SettingsProviderProps) {
  let unlisten: (() => void) | undefined
  let cleanupSystemThemeListener: (() => void) | undefined

  onMount(async () => {
    consola.log('[SettingsProvider] onMount() - Loading initial settings')

    // Set up system theme listener FIRST
    consola.log('[SettingsProvider] Setting up system theme listener')
    cleanupSystemThemeListener = initSystemThemeListener()
    consola.log('[SettingsProvider] System theme listener initialized')

    // CRITICAL: Set up event listener FIRST before loading settings
    consola.log('[SettingsProvider] Setting up event listener for settings://updated')
    unlisten = await listen<AppSettings>('settings://updated', (event) => {
      consola.log('[SettingsProvider] ✅ Event received: settings://updated')
      consola.log('[SettingsProvider] Event payload:', event.payload)
      consola.log('[SettingsProvider] Store state BEFORE update:', settingsStore.get())

      settingsStore.set(event.payload)

      consola.log('[SettingsProvider] Store state AFTER update:', settingsStore.get())
    })
    consola.log('[SettingsProvider] Event listener registered successfully')

    // Now load initial settings
    await loadSettings()
    consola.log('[SettingsProvider] Initial settings loaded')
  })

  onCleanup(() => {
    consola.log('[SettingsProvider] onCleanup() - Cleaning up')
    unlisten?.()
    cleanupSystemThemeListener?.()
    consola.log('[SettingsProvider] System theme listener cleaned up')
  })

  useThemeAttributes()

  consola.log('[SettingsProvider] Theme attributes hook initialized')
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
