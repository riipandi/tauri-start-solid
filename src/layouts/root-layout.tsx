import { getCurrentWindow } from '@tauri-apps/api/window'
import { ParentComponent } from 'solid-js'
import { ThemeProvider } from '#/components/theme/provider'
import { createUpdateHandler } from '#/context/hooks/use-updater'
import { clx } from '#/libs/utils'

const RootLayout: ParentComponent = (props) => {
  const appWindow = getCurrentWindow()
  const isMaximized = appWindow.isMaximized()

  // Handler for update events
  createUpdateHandler()

  return (
    <ThemeProvider>
      <div
        class={clx(
          'disable-select relative flex size-full h-svh flex-col overflow-hidden',
          !isMaximized && 'rounded-[10px]'
        )}
      >
        {props.children}
      </div>
    </ThemeProvider>
  )
}

export default RootLayout
