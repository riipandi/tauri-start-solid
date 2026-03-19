import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

export interface UpdateInfo {
  version: string
  date: string
  notes: string
  body: string
}

export interface UpdateState {
  last_check: string | null
  pending_version: string | null
  pending_date: string | null
  pending_notes: string | null
  downloaded: boolean
}

export interface DownloadEvent {
  event: 'Started' | 'Progress' | 'Finished'
  data?: {
    contentLength?: number
    chunkLength?: number
  }
}

export interface UpdaterService {
  checkForUpdates: () => Promise<UpdateInfo | null>
  downloadUpdate: (onProgress: (event: DownloadEvent) => void) => Promise<void>
  installUpdate: () => Promise<void>
  getUpdateState: () => Promise<UpdateState>
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => Promise<() => void>
  onDownloadProgress: (callback: (event: DownloadEvent) => void) => Promise<() => void>
  onReadyToInstall: (callback: () => void) => Promise<() => void>
  onError: (callback: (error: string) => void) => Promise<() => void>
}

function defineService(): UpdaterService {
  return {
    async checkForUpdates() {
      try {
        return await invoke<UpdateInfo | null>('check_for_updates')
      } catch (error) {
        console.error('[Updater] Error checking for updates:', error)
        throw error
      }
    },

    async downloadUpdate(onProgress) {
      try {
        await invoke('download_update', {
          onEvent: { emit: (event: DownloadEvent) => onProgress(event) }
        })
      } catch (error) {
        console.error('[Updater] Error downloading update:', error)
        throw error
      }
    },

    async installUpdate() {
      try {
        await invoke('install_update')
      } catch (error) {
        console.error('[Updater] Error installing update:', error)
        throw error
      }
    },

    async getUpdateState() {
      try {
        return await invoke<UpdateState>('get_update_state')
      } catch (error) {
        console.error('[Updater] Error getting update state:', error)
        throw error
      }
    },

    async onUpdateAvailable(callback) {
      const unlisten = await listen<UpdateInfo>('updater://update-available', (event) => {
        callback(event.payload)
      })
      return unlisten
    },

    async onDownloadProgress(callback) {
      const unlisten = await listen<DownloadEvent>('updater://download-progress', (event) => {
        callback(event.payload)
      })
      return unlisten
    },

    async onReadyToInstall(callback) {
      const unlisten = await listen('updater://ready-to-install', () => {
        callback()
      })
      return unlisten
    },

    async onError(callback) {
      const unlisten = await listen<string>('updater://error', (event) => {
        callback(event.payload)
      })
      return unlisten
    }
  }
}

export const updaterService = defineService()
export default defineService()
