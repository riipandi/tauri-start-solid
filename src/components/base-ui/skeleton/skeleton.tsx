import { type ComponentProps, splitProps } from 'solid-js'
import { clx } from '#/libs/utils'

export const Skeleton = (props: ComponentProps<'div'>) => {
  const [local, rest] = splitProps(props, ['class'])

  return <div class={clx('animate-pulse rounded-md bg-primary/10', local.class)} {...rest} />
}
