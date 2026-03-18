import { consola } from 'consola'
import { atom, computed } from 'nanostores'
import { settingsService } from '#/services/settings.service'
import type { AppSettings, UISettings } from '#/types/settings'

export const settingsStore = atom<AppSettings>({
  ui: {
    theme_mode: 'auto',
    theme_light: 'defaultLight',
    theme_dark: 'defaultDark',
    enable_spell_check: true
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
  consola.log('[stores/settings] loadSettings() called')
  const settings = await settingsService.getSettings()
  consola.log('[stores/settings] loadSettings() received from backend:', settings)
  settingsStore.set(settings)
  consola.log('[stores/settings] loadSettings() store state after set:', settingsStore.get())
}

export async function updateSettings(update: Partial<AppSettings>) {
  consola.log('[stores/settings] updateSettings() called with:', update)
  const current = settingsStore.get()
  consola.log('[stores/settings] updateSettings() current state:', current)

  const merged: AppSettings = {
    ...current,
    ...update,
    ui: {
      ...current.ui,
      ...update.ui
    }
  }

  consola.log('[stores/settings] updateSettings() merged state:', merged)

  const saved = await settingsService.updateSettings(merged)
  consola.log('[stores/settings] updateSettings() saved from backend:', saved)

  settingsStore.set(saved)
  consola.log('[stores/settings] updateSettings() store state after set:', settingsStore.get())
}

export async function resetSettings() {
  consola.log('[stores/settings] resetSettings() called')
  const defaults = await settingsService.resetSettings()
  consola.log('[stores/settings] resetSettings() received from backend:', defaults)
  consola.log('[stores/settings] resetSettings() calling settingsStore.set()')
  settingsStore.set(defaults)
  consola.log('[stores/settings] resetSettings() final store state:', settingsStore.get())
  consola.log('[stores/settings] resetSettings() completed')
}

export async function updateUISettings(update: Partial<UISettings>) {
  consola.log('[stores/settings] updateUISettings() called with:', update)
  const current = settingsStore.get()
  const mergedUI: UISettings = {
    ...current.ui,
    ...update
  }
  consola.log('[stores/settings] updateUISettings() merged UI:', mergedUI)
  return updateSettings({ ui: mergedUI })
}

loadSettings()
