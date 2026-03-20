import { getName, getVersion, getTauriVersion } from '@tauri-apps/api/app'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform, type Platform } from '@tauri-apps/plugin-os'
import { consola } from 'consola'
import { createSignal, onCleanup, onMount } from 'solid-js'

export function useAppInfo() {
  const [appName, setAppName] = createSignal<string>('')
  const [appVersion, setAppVersion] = createSignal<string>('')
  const [osPlatform, setOsPlatform] = createSignal<Platform>('macos')
  const [tauriVersion, setTauriVersion] = createSignal<string>('')
  const [isFullscreen, setIsFullscreen] = createSignal(false)
  const [isMaximized, setIsMaximized] = createSignal(false)

  const appWindow = getCurrentWindow()

  const checkFullscreen = async () => {
    try {
      const fs = await appWindow.isFullscreen()
      setIsFullscreen(fs)
    } catch (error) {
      consola.error('[useAppInfo] Failed to check fullscreen:', error)
    }
  }

  const checkMaximized = async () => {
    try {
      const maximized = await appWindow.isMaximized()
      setIsMaximized(maximized)
    } catch (error) {
      consola.error('[useAppInfo] Failed to check maximized:', error)
    }
  }

  onMount(async () => {
    setOsPlatform(platform())

    const [name, version, tauriVersion] = await Promise.all([
      getName(),
      getVersion(),
      getTauriVersion()
    ])

    setAppName(name)
    setAppVersion(version)
    setTauriVersion(tauriVersion)

    await checkFullscreen()
    await checkMaximized()

    const unlistenResize = await listen('tauri://resize', async () => {
      await checkFullscreen()
      await checkMaximized()
    })

    onCleanup(() => {
      unlistenResize()
    })
  })

  const minimize = async () => {
    try {
      await appWindow.minimize()
    } catch (error) {
      consola.error('[useAppInfo] Failed to minimize:', error)
    }
  }

  const toggleMaximize = async () => {
    try {
      await appWindow.toggleMaximize()

      await checkMaximized()
    } catch (error) {
      consola.error('[useAppInfo] Failed to toggle maximize:', error)
    }
  }

  const close = async () => {
    try {
      await appWindow.close()
    } catch (error) {
      consola.error('[useAppInfo] Failed to close:', error)
    }
  }

  return {
    appName,
    appVersion,
    osPlatform,
    tauriVersion,
    isFullscreen,
    isMaximized,
    toggleMaximize,
    minimize,
    close
  }
}
