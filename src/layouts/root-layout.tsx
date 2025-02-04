import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import consola from 'consola'
import { ParentComponent, Suspense, onMount } from 'solid-js'
import AppLoader from '#/components/loaders/app-loader'
import { ThemeProvider } from '#/components/theme/provider'
import Titlebar from '#/components/titlebar/titlebar'
import { clx } from '#/libs/utils'

const RootLayout: ParentComponent = (props) => {
  const appWindow = getCurrentWindow()
  const isMaximized = appWindow.isMaximized()

  onMount(() => {
    // Listen for check-update event from Rust
    const unlisten = listen<number>('check-update', (event) => {
      consola.log('Check update triggered at:', new Date(event.payload))
    })

    // Cleanup listener when component unmounts
    return () => {
      unlisten.then((unlistenFn) => unlistenFn())
    }
  })

  return (
    <ThemeProvider>
      <div
        class={clx(
          'disable-select relative flex size-full h-svh flex-col overflow-hidden',
          !isMaximized && 'rounded-[10px]'
        )}
      >
        <Titlebar />
        <main
          class={clx(
            'custom-scrollbar relative flex-1 overflow-auto',
            !isMaximized && 'rounded-b-[10px]'
          )}
        >
          <div class={clx('mx-auto size-full', !isMaximized && 'rounded-bl-[10px]')}>
            <Suspense fallback={<AppLoader />}>{props.children}</Suspense>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default RootLayout
