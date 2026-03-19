import { atom, computed } from 'nanostores'
import { settingsService } from '#/services/settings.service'
import type { AppSettings, UISettings, ThemeName } from '#/types/settings'

export const settingsStore = atom<AppSettings>({
  license_key: undefined,
  ui: {
    theme_mode: 'auto',
    theme_light: 'default-light',
    theme_dark: 'default-dark',
    enable_spell_check: false,
    update_check_frequency: 'on-startup'
  }
})

export const systemThemeStore = atom<'light' | 'dark'>('light')

export const uiSettings = computed(settingsStore, (s) => s.ui)
export const themeMode = computed(settingsStore, (s) => s.ui.theme_mode)
export const licenseKey = computed(settingsStore, (s) => s.license_key)

export const currentTheme = computed([settingsStore, systemThemeStore], (settings, systemTheme) => {
  switch (settings.ui.theme_mode) {
    case 'dark':
      return settings.ui.theme_dark || 'default-dark'
    case 'light':
      return settings.ui.theme_light || 'default-light'
    case 'auto':
    default:
      return systemTheme === 'dark'
        ? settings.ui.theme_dark || 'default-dark'
        : settings.ui.theme_light || 'default-light'
  }
})

export async function loadSettings() {
  settingsStore.set(await settingsService.getSettings())
}

export async function updateSettings(update: Partial<AppSettings>) {
  const current = settingsStore.get()
  const merged: AppSettings = { ...current, ...update, ui: { ...current.ui, ...update.ui } }
  const saved = await settingsService.updateSettings(merged)
  settingsStore.set(saved)
}

export async function resetSettings() {
  const defaults = await settingsService.resetSettings()
  settingsStore.set(defaults)
}

export async function updateUISettings(update: Partial<UISettings>) {
  const current = settingsStore.get()
  const mergedUI: UISettings = { ...current.ui, ...update }
  return updateSettings({ ui: mergedUI })
}

export async function updateTheme(mode: 'light' | 'dark', theme: ThemeName) {
  const updatedUI: Partial<UISettings> = {}

  if (mode === 'light') {
    updatedUI.theme_light = theme
  } else {
    updatedUI.theme_dark = theme
  }

  return updateUISettings(updatedUI)
}

export async function updateLicenseKey(licenseKey: string) {
  return updateSettings({ license_key: licenseKey })
}

loadSettings()
