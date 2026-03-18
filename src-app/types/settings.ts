import type { Atom } from 'nanostores'

export type ThemeMode = 'auto' | 'dark' | 'light'
export type ThemeName = 'default-light' | 'default-dark' | 'modern-light' | 'modern-dark'

export interface UISettings {
  theme_mode: ThemeMode
  theme_light: ThemeName
  theme_dark: ThemeName
  enable_spell_check: boolean
}

export interface AppSettings {
  license_key?: string
  ui: UISettings
}

export type SettingsStore = Atom<AppSettings>
