import { Button as BaseButton } from '@kobalte/core/button'
import { clsx } from 'clsx'
import { splitProps } from 'solid-js'
import * as styles from '#/styles/components/button.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: any
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['variant', 'children', 'class'])

  const variant = () => local.variant ?? 'primary'

  return (
    <BaseButton class={clsx(styles.base, styles[variant()], local.class ?? '')} {...rest}>
      {local.children}
    </BaseButton>
  )
}
