import { Button as BaseButton } from '@kobalte/core/button'
import { clsx } from 'clsx'
import { splitProps, type JSXElement } from 'solid-js'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  children: JSXElement
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

const variantStyles = {
  primary:
    'border border-border-primary/30 bg-background-primary/14 text-foreground-primary hover:-translate-y-0.5 hover:bg-background-primary/24 active:translate-y-0',
  secondary:
    'border border-border-neutral/20 bg-background-page/50 text-foreground-neutral hover:-translate-y-0.5 hover:border-foreground-neutral/35 active:translate-y-0',
  danger:
    'border border-border-critical/30 bg-background-critical/14 text-foreground-critical hover:-translate-y-0.5 hover:bg-background-critical/24 active:translate-y-0'
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ['variant', 'children', 'class'])

  const variant = () => local.variant ?? 'primary'

  return (
    <BaseButton
      class={clsx(
        'text-[13px] font-medium inline-flex items-center justify-center rounded-md py-1.5 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant()],
        local.class ?? ''
      )}
      {...rest}
    >
      {local.children}
    </BaseButton>
  )
}
