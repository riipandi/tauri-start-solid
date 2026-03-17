import type { Atom } from 'nanostores'

export type ThemeMode = 'auto' | 'dark' | 'light'

export interface UISettings {
  theme_mode: ThemeMode
  theme_light: string
  theme_dark: string
  enable_spell_check: boolean
  enable_auto_capitalize: boolean
  enable_auto_complete_form: boolean
}

export interface AppSettings {
  ui: UISettings
}

export type SettingsStore = Atom<AppSettings>
