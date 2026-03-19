import type { Atom } from 'nanostores'

export type ThemeMode = 'auto' | 'dark' | 'light'
export type ThemeName = 'default-light' | 'default-dark' | 'modern-light' | 'modern-dark'
export type UpdateCheckFrequency = 'on-startup' | 'daily' | 'weekly' | 'monthly' | 'never'

export interface UISettings {
  theme_mode: ThemeMode
  theme_light: ThemeName
  theme_dark: ThemeName
  enable_spell_check: boolean
  update_check_frequency: UpdateCheckFrequency
}

export interface AppSettings {
  license_key?: string
  ui: UISettings
}

export type SettingsStore = Atom<AppSettings>
