import { invoke } from '@tauri-apps/api/core'
import type { AppSettings } from '#/schemas/settings.schema'

export interface SettingsService {
  openWindow: () => void
  getSettings: () => Promise<AppSettings>
  updateSettings: (settings: AppSettings) => Promise<AppSettings>
  resetSettings: () => Promise<AppSettings>
}

function defineService(): SettingsService {
  return {
    async openWindow() {
      return await invoke('open_settings_window')
    },

    async getSettings() {
      return await invoke<AppSettings>('get_settings')
    },

    async updateSettings(settings: AppSettings) {
      return await invoke<AppSettings>('update_settings', { settings })
    },

    async resetSettings() {
      return await invoke<AppSettings>('reset_settings')
    }
  }
}

export const settingsService = defineService()
export default defineService()
