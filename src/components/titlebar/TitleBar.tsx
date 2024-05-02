import { useCallback, useEffect, useState } from 'react'
import { getCurrent } from '@tauri-apps/api/window'
import { type OsType, type as getOsType } from '@tauri-apps/plugin-os'

import CaptionControl from './CaptionControl'
import TrafficLight from './TrafficLight'
import './titlebar.css'
import { clx } from '@/utils/helpers'

export function CustomTitleBar({ children }: React.PropsWithChildren) {
  const [platform, setPlatform] = useState<OsType>('macos')
  const [isFocused, setIsFocused] = useState<boolean>(true)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)

  const win = getCurrent()

  const handleMinimize = useCallback(async () => {
    const isMinimized = await win.isMinimized()
    return isMinimized ? await win.unminimize() : await win.minimize()
  }, [win])

  const handleMaximize = useCallback(async () => {
    const isMaximized = await win.isMaximized()
    return isMaximized ? await win.unmaximize() : await win.maximize()
  }, [win])

  const handleFullScreen = useCallback(async () => {
    const isMaximized = await win.isFullscreen()
    return await win.setFullscreen(!isMaximized)
  }, [win])

  const handleClose = useCallback(async () => {
    await win.close()
  }, [win])

  useEffect(() => {
    getOsType().then(setPlatform)

    // @ref: https://beta.tauri.app/references/v2/js/core/namespaceevent
    win.listen('tauri://webview-created', () => setIsFocused(true))
    win.listen('tauri://focus', () => setIsFocused(true))
    win.listen('tauri://blur', () => setIsFocused(false))
    win.listen('tauri://resize', () => win.isFullscreen().then(setIsFullScreen))
  }, [win])

  return platform === 'macos' ? (
    <div data-tauri-drag-region className="titlebar-root">
      <TrafficLight
        handleMinimize={handleMinimize}
        handleMaximize={handleFullScreen}
        handleClose={handleClose}
        isFocused={isFocused}
      />
      <div
        data-tauri-drag-region
        className={clx(isFullScreen ? 'pl-2' : 'pl-[72px]', 'titlebar-content')}
      >
        {children}
      </div>
    </div>
  ) : (
    <div data-tauri-drag-region className="titlebar-root">
      <div data-tauri-drag-region className="titlebar-content">
        {children}
      </div>
      <CaptionControl
        handleMinimize={handleMinimize}
        handleMaximize={handleMaximize}
        handleClose={handleClose}
        isFocused={isFocused}
      />
    </div>
  )
}

export function DefaultTitleBar() {
  return (
    <div
      className="absolute w-full h-7 bg-transparent z-10 rounded-t-[10px]"
      data-tauri-drag-region
    />
  )
}
