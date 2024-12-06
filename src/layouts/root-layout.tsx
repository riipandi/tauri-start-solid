import { ColorModeProvider, ColorModeScript } from '@kobalte/core'
import { MetaProvider } from '@solidjs/meta'
import { ComponentProps, Suspense } from 'solid-js'
import { clx } from '#/libs/utils'

interface RootLayoutProps extends ComponentProps<'div'> {}

const PageLoader = () => {
  return (
    <div class="size-full min-h-screen bg-background">
      <div class="flex h-full items-center justify-center">
        <h1 class="text-foreground">Loading...</h1>
      </div>
    </div>
  )
}

const RootLayout = (props: RootLayoutProps) => {
  return (
    <MetaProvider>
      <Suspense fallback={<PageLoader />}>
        <ColorModeProvider>
          <div class={clx('root-layout', props.class)}>{props.children}</div>
        </ColorModeProvider>
        <ColorModeScript storageType="localStorage" />
      </Suspense>
    </MetaProvider>
  )
}

export default RootLayout
