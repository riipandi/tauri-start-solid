import { atom, computed } from 'nanostores'
import { settingsService } from '#/services/settings.service'
import type { AppSettings, UISettings } from '#/types/settings'

export const settingsStore = atom<AppSettings>({
  ui: {
    theme_mode: 'auto',
    theme_light: 'defaultLight',
    theme_dark: 'defaultDark',
    enable_spell_check: true,
    enable_auto_capitalize: true,
    enable_auto_complete_form: true
  }
})

export const uiSettings = computed(settingsStore, (s) => s.ui)
export const themeMode = computed(settingsStore, (s) => s.ui.theme_mode)

export const currentTheme = computed(settingsStore, (s) => {
  switch (s.ui.theme_mode) {
    case 'dark':
      return s.ui.theme_dark || 'defaultDark'
    case 'light':
      return s.ui.theme_light || 'defaultLight'
    case 'auto':
    default:
      return s.ui.theme_dark || 'defaultDark'
  }
})

export async function loadSettings() {
  console.log('[stores/settings] loadSettings() called')
  const settings = await settingsService.getSettings()
  console.log('[stores/settings] loadSettings() received from backend:', settings)
  settingsStore.set(settings)
  console.log('[stores/settings] loadSettings() store state after set:', settingsStore.get())
}

export async function updateSettings(update: Partial<AppSettings>) {
  console.log('[stores/settings] updateSettings() called with:', update)
  const current = settingsStore.get()
  console.log('[stores/settings] updateSettings() current state:', current)

  const merged: AppSettings = {
    ...current,
    ...update,
    ui: {
      ...current.ui,
      ...update.ui
    }
  }

  console.log('[stores/settings] updateSettings() merged state:', merged)

  const saved = await settingsService.updateSettings(merged)
  console.log('[stores/settings] updateSettings() saved from backend:', saved)

  settingsStore.set(saved)
  console.log('[stores/settings] updateSettings() store state after set:', settingsStore.get())
}

export async function resetSettings() {
  console.log('[stores/settings] resetSettings() called')
  const defaults = await settingsService.resetSettings()
  console.log('[stores/settings] resetSettings() received from backend:', defaults)
  console.log('[stores/settings] resetSettings() calling settingsStore.set()')
  settingsStore.set(defaults)
  console.log('[stores/settings] resetSettings() final store state:', settingsStore.get())
  console.log('[stores/settings] resetSettings() completed')
}

export async function updateUISettings(update: Partial<UISettings>) {
  console.log('[stores/settings] updateUISettings() called with:', update)
  const current = settingsStore.get()
  const mergedUI: UISettings = {
    ...current.ui,
    ...update
  }
  console.log('[stores/settings] updateUISettings() merged UI:', mergedUI)
  return updateSettings({ ui: mergedUI })
}

loadSettings()
