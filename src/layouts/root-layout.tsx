import { ParentComponent, Suspense } from 'solid-js'
import ScreenLoader from '#/components/loaders/screen-loader'
import { ThemeProvider } from '#/components/theme/provider'

const RootLayout: ParentComponent = (props) => {
  return (
    <div class="size-full rounded-b-[10px] bg-transparent">
      <ThemeProvider>
        <Suspense fallback={<ScreenLoader />}>{props.children}</Suspense>
      </ThemeProvider>
    </div>
  )
}

export default RootLayout
