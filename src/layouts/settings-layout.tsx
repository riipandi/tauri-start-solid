import { ParentComponent, Suspense } from 'solid-js'
import AppLoader from '#/components/loaders/app-loader'
import Titlebar from '#/components/titlebar/titlebar'
import { clx } from '#/libs/utils'

const SettingsLayout: ParentComponent = (props) => {
  return (
    <>
      <Titlebar class="debug border-0 shadow-none" />
      <main class={clx('custom-scrollbar relative flex-1 overflow-auto')}>
        <div class={clx('mx-auto size-full')}>
          <Suspense fallback={<AppLoader />}>{props.children}</Suspense>
        </div>
      </main>
    </>
  )
}

export default SettingsLayout
