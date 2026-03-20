import type { Atom } from 'nanostores'

export type ThemeMode = 'auto' | 'dark' | 'light'
export type ThemeName = 'default-light' | 'default-dark' | 'modern-light' | 'modern-dark'

export type UpdateCheckFrequency = 'on-startup' | 'daily' | 'weekly' | 'monthly' | 'never'
export type UpdateChannel = 'stable' | 'canary'
export type UpdateMode = 'automatic' | 'manual'

export interface UISettings {
  editor_font_family: string
  editor_font_size: number
  enable_spell_check: boolean
  theme_dark: ThemeName
  theme_light: ThemeName
  theme_mode: ThemeMode
  ui_font_family: string
  ui_font_size: number
  update_check_frequency: UpdateCheckFrequency
}

export interface UpdateSettings {
  channel: UpdateChannel
  mode: UpdateMode
  auto_download: boolean
}

export interface AppSettings {
  license_key?: string
  ui: UISettings
  update: UpdateSettings
}

export type SettingsStore = Atom<AppSettings>
