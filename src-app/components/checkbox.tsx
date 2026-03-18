import * as BaseCheckbox from '@kobalte/core/checkbox'
import { clsx } from 'clsx'
import { Show } from 'solid-js'
import { Label } from './label'

interface CheckboxProps {
  name?: string
  label?: string
  description?: string
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
      class={clsx('flex items-start gap-3', props.class)}
    >
      <BaseCheckbox.Input name={props.name} class='hidden' />

      <BaseCheckbox.Control
        class={clsx(
          'relative shrink-0 w-5 h-5',
          'rounded border border-border-neutral bg-background-page',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-page',
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
          <svg
            class='w-3.5 h-3.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='3'
              d='M5 13l4 4L19 7'
            />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Control>

      <Show when={props.label || props.description}>
        <div class='flex flex-col'>
          <BaseCheckbox.Label
            as={Label}
            label={props.label ?? ''}
            description={props.description}
            class='cursor-pointer'
          />
        </div>
      </Show>
    </BaseCheckbox.Root>
  )
}
