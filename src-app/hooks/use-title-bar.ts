import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform, type Platform } from '@tauri-apps/plugin-os'
import { consola } from 'consola'
import { createSignal, onCleanup, onMount } from 'solid-js'

export function useTitleBar() {
  const [currentPlatform, setCurrentPlatform] = createSignal<Platform>('macos')
  const [isFullscreen, setIsFullscreen] = createSignal(false)
  const [isMaximized, setIsMaximized] = createSignal(false)

  const appWindow = getCurrentWindow()

  const checkFullscreen = async () => {
    try {
      const fs = await appWindow.isFullscreen()
      setIsFullscreen(fs)
    } catch (error) {
      consola.error('[useTitleBar] Failed to check fullscreen:', error)
    }
  }

  const checkMaximized = async () => {
    try {
      const maximized = await appWindow.isMaximized()
      setIsMaximized(maximized)
    } catch (error) {
      consola.error('[useTitleBar] Failed to check maximized:', error)
    }
  }

  onMount(async () => {
    const platformResult = await platform()
    setCurrentPlatform(platformResult)
    consola.log('[useTitleBar] Platform:', platformResult)

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
      consola.log('[useTitleBar] Window minimized')
    } catch (error) {
      consola.error('[useTitleBar] Failed to minimize:', error)
    }
  }

  const toggleMaximize = async () => {
    try {
      await appWindow.toggleMaximize()
      consola.log('[useTitleBar] Window maximize toggled')
      await checkMaximized()
    } catch (error) {
      consola.error('[useTitleBar] Failed to toggle maximize:', error)
    }
  }

  const close = async () => {
    try {
      await appWindow.close()
      consola.log('[useTitleBar] Window close requested')
    } catch (error) {
      consola.error('[useTitleBar] Failed to close:', error)
    }
  }

  return {
    platform: currentPlatform,
    isFullscreen,
    isMaximized,
    minimize,
    toggleMaximize,
    close
  }
}
