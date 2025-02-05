import type { ButtonRootProps } from '@kobalte/core/button'
import { Button as ButtonPrimitive } from '@kobalte/core/button'
import type { PolymorphicProps } from '@kobalte/core/polymorphic'
import { JSX, type ValidComponent, splitProps } from 'solid-js'
import { clx } from '#/libs/utils'
import { ButtonVariants, buttonStyles } from './button.css'

/**
 * Button component props type definition
 */
export type ButtonProps<T extends ValidComponent = 'button'> = ButtonRootProps<T> &
  ButtonVariants & {
    class?: string
    loading?: boolean
    onClick?: (e: Event & { currentTarget: HTMLButtonElement; target: JSX.Element }) => void
  }

/**
 * Button component with multiple variants and sizes
 */
export const Button = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, ButtonProps<T>>
) => {
  const [local, rest] = splitProps(props as ButtonProps, ['class', 'variant', 'size', 'fullWidth'])

  return (
    <ButtonPrimitive
      class={clx(
        buttonStyles({
          variant: local.variant,
          size: local.size,
          fullWidth: local.fullWidth,
        }),
        local.class
      )}
      {...rest}
    />
  )
}
