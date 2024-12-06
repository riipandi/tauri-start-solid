import { ComponentProps } from 'solid-js'
import { clx } from '#/libs/utils'

interface RootLayoutProps extends ComponentProps<'div'> {}

const RootLayout = (props: RootLayoutProps) => {
  return <div class={clx('root-layout', props.class)}>{props.children}</div>
}

export default RootLayout
