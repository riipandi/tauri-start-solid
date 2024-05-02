import type { AppSettings } from '@/types/bindings'
import { invoke } from '@tauri-apps/api/core'

type SettingsData = {
  param: string
  value: AppSettings[keyof AppSettings][]
}

export async function getAppSettings(): Promise<AppSettings> {
  return await invoke<AppSettings>('get_app_settings')
}

export async function getSetting<T extends keyof AppSettings>(param: T): Promise<AppSettings[T]> {
  return await invoke<AppSettings[T]>('get_setting', { param })
}

export async function getSettingsData(): Promise<SettingsData> {
  return await invoke<SettingsData>('get_settings_data')
}
