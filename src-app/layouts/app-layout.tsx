import { getCurrentWindow } from '@tauri-apps/api/window'
import { ParentComponent, Suspense } from 'solid-js'
import AppLoader from '#/components/loaders/app-loader'
import Titlebar from '#/components/titlebar/titlebar'
import { clx } from '#/libs/utils'

const AppLayout: ParentComponent = (props) => {
  const appWindow = getCurrentWindow()
  const isMaximized = appWindow.isMaximized()

  return (
    <>
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
    </>
  )
}

export default AppLayout
