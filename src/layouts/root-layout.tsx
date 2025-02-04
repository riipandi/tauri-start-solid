import { ParentComponent, Suspense } from 'solid-js'
import AppLoader from '#/components/loaders/app-loader'
import { ThemeProvider } from '#/components/theme/provider'

const RootLayout: ParentComponent = (props) => {
  return (
    <div class="size-full rounded-b-[10px] bg-transparent">
      <ThemeProvider>
        <Suspense fallback={<AppLoader />}>{props.children}</Suspense>
      </ThemeProvider>
    </div>
  )
}

export default RootLayout
