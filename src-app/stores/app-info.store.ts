import { getName, getVersion, getTauriVersion } from '@tauri-apps/api/app'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform, type Platform } from '@tauri-apps/plugin-os'
import { consola } from 'consola'
import { atom } from 'nanostores'

export const appName = atom<string>('')
export const appVersion = atom<string>('')
export const tauriVersion = atom<string>('')
export const osPlatform = atom<Platform>('macos')
export const isFullscreen = atom(false)
export const isMaximized = atom(false)

let initialized = false
let cleanupResize: (() => void) | null = null

export async function initAppInfo() {
  if (initialized) {
    consola.debug('[app-info.store] Already initialized, skipping')
    return
  }

  consola.debug('[app-info.store] Initializing app info store')
  initialized = true

  osPlatform.set(platform())

  const [name, version, tauriVer] = await Promise.all([getName(), getVersion(), getTauriVersion()])

  appName.set(name)
  appVersion.set(version)
  tauriVersion.set(tauriVer)

  const appWindow = getCurrentWindow()

  const checkFullscreen = async () => {
    try {
      const fs = await appWindow.isFullscreen()
      isFullscreen.set(fs)
    } catch (error) {
      consola.error('[app-info.store] Failed to check fullscreen:', error)
    }
  }

  const checkMaximized = async () => {
    try {
      const maximized = await appWindow.isMaximized()
      isMaximized.set(maximized)
    } catch (error) {
      consola.error('[app-info.store] Failed to check maximized:', error)
    }
  }

  await checkFullscreen()
  await checkMaximized()

  cleanupResize = await listen('tauri://resize', async () => {
    await checkFullscreen()
    await checkMaximized()
  })

  consola.debug('[app-info.store] App info store initialized successfully')
}

export function cleanupAppInfo() {
  if (cleanupResize) {
    cleanupResize()
    cleanupResize = null
  }
  initialized = false
  consola.debug('[app-info.store] App info store cleaned up')
}

export async function minimizeWindow() {
  try {
    await getCurrentWindow().minimize()
  } catch (error) {
    consola.error('[app-info.store] Failed to minimize:', error)
  }
}

export async function toggleMaximizeWindow() {
  try {
    const appWindow = getCurrentWindow()
    await appWindow.toggleMaximize()
    await checkMaximized()
  } catch (error) {
    consola.error('[app-info.store] Failed to toggle maximize:', error)
  }
}

async function checkMaximized() {
  try {
    const maximized = await getCurrentWindow().isMaximized()
    isMaximized.set(maximized)
  } catch (error) {
    consola.error('[app-info.store] Failed to check maximized:', error)
  }
}

export async function closeWindow() {
  try {
    await getCurrentWindow().close()
  } catch (error) {
    consola.error('[app-info.store] Failed to close:', error)
  }
}
