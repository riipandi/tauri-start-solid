import { atom, computed } from 'nanostores'
import { settingsService } from '#/services/settings.service'
import type { AppSettings, UISettings, ThemeName } from '#/types/settings'

export const settingsStore = atom<AppSettings>({
  ui: {
    theme_mode: 'auto',
    theme_light: 'default-light',
    theme_dark: 'default-dark',
    enable_spell_check: false
  }
})

export const systemThemeStore = atom<'light' | 'dark'>('light')

export const uiSettings = computed(settingsStore, (s) => s.ui)
export const themeMode = computed(settingsStore, (s) => s.ui.theme_mode)

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

const themePairMap: Record<ThemeName, ThemeName> = {
  'default-light': 'default-dark',
  'default-dark': 'default-light',
  'modern-light': 'modern-dark',
  'modern-dark': 'modern-light'
}

export function getPairedTheme(theme: ThemeName): ThemeName {
  return themePairMap[theme]
}

export function initSystemThemeListener(): (() => void) | undefined {
  if (typeof window === 'undefined') return undefined

  const updateSystemTheme = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    systemThemeStore.set(isDark ? 'dark' : 'light')
  }

  updateSystemTheme()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateSystemTheme)

  return () => {
    mediaQuery.removeEventListener('change', updateSystemTheme)
  }
}

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

export async function updateThemeWithSync(mode: 'light' | 'dark', theme: ThemeName) {
  const pairedTheme = getPairedTheme(theme)
  const updatedUI: Partial<UISettings> = {}

  if (mode === 'light') {
    updatedUI.theme_light = theme
    updatedUI.theme_dark = pairedTheme
  } else {
    updatedUI.theme_dark = theme
    updatedUI.theme_light = pairedTheme
  }

  return updateUISettings(updatedUI)
}

loadSettings()
