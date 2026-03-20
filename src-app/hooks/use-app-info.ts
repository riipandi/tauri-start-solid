import { useStore } from '@nanostores/solid'
import {
  appName,
  appVersion,
  osPlatform,
  tauriVersion,
  isFullscreen,
  isMaximized,
  initAppInfo,
  minimizeWindow,
  toggleMaximizeWindow,
  closeWindow
} from '#/stores/app-info.store'

export function useAppInfo() {
  return {
    appName: useStore(appName),
    appVersion: useStore(appVersion),
    osPlatform: useStore(osPlatform),
    tauriVersion: useStore(tauriVersion),
    isFullscreen: useStore(isFullscreen),
    isMaximized: useStore(isMaximized),
    toggleMaximize: toggleMaximizeWindow,
    minimize: minimizeWindow,
    close: closeWindow,
    init: initAppInfo
  }
}
