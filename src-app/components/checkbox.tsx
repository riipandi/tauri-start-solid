import * as BaseCheckbox from '@kobalte/core/checkbox'
import { clsx } from 'clsx'

interface CheckboxProps {
  name?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
}

export function Checkbox(props: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      checked={props.checked}
      onChange={props.onChange}
      disabled={props.disabled}
      class={clsx('flex items-center gap-2', props.class)}
    >
      <BaseCheckbox.Input name={props.name} class='hidden' />

      <BaseCheckbox.Control
        class={clsx(
          'relative shrink-0 w-4 h-4',
          'rounded border border-border-neutral bg-background-page',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background-page',
          'hover:border-primary/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'data-checked:bg-primary data-checked:border-primary',
          'data-checked:hover:bg-primary/90'
        )}
      >
        <BaseCheckbox.Indicator
          class='flex items-center justify-center text-on-background-primary'
          forceMount
        >
          <svg class='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7' />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Control>
    </BaseCheckbox.Root>
  )
}