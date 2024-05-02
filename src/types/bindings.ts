/*
 Generated by typeshare 1.8.0
*/

export enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark',
}

export interface AppSettings {
  theme: Theme
  zoom_factor: number
  auto_check_updates: boolean
  code_editor_theme: string
}
