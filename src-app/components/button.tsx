import { Button as BaseButton } from '@kobalte/core/button'
import { clsx } from 'clsx'
import { splitProps } from 'solid-js'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: any
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const variantStyles = {
  primary:
    'border border-primary/30 bg-primary/14 text-primary hover:-translate-y-0.5 hover:bg-primary/24 active:translate-y-0',
  secondary:
    'border border-border-neutral/20 bg-background-page/50 text-foreground-neutral hover:-translate-y-0.5 hover:border-foreground-neutral/35 active:translate-y-0'
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['variant', 'children', 'class'])

  const variant = () => local.variant ?? 'primary'

  return (
    <BaseButton
      class={clsx(
        'text-sm font-semibold inline-flex items-center justify-center rounded-full py-2.5 px-5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant()],
        local.class ?? ''
      )}
      {...rest}
    >
      {local.children}
    </BaseButton>
  )
}
