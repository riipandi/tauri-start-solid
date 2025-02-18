import type { Assign } from '@ark-ui/solid'
import { type HTMLArkProps, ark } from '@ark-ui/solid/factory'
import * as Lucide from 'lucide-solid'
import { type Component, splitProps } from 'solid-js'
import { type ButtonVariants, buttonStyles } from './button.css'

export interface ButtonProps extends Assign<HTMLArkProps<'button'>, ButtonVariants> {}

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'class',
    'isLoading',
    'disabled',
    'children',
    'asChild',
  ])

  const isDisabled = () => local.disabled || local.isLoading
  const styles = buttonStyles({
    variant: local.variant,
    size: local.size,
    isLoading: local.isLoading,
    class: local.class,
  })

  return (
    <ark.button
      class={styles}
      data-loading={local.isLoading}
      disabled={isDisabled()}
      asChild={local.asChild}
      {...others}
    >
      {local.isLoading && <Lucide.Loader2 strokeWidth={2} />}
      {local.children}
    </ark.button>
  )
}

export { Button }
