import { Switch as BaseSwitch } from '@kobalte/core/switch'
import { clsx } from 'clsx'

interface SwitchProps {
  name?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
}

export function Switch(props: SwitchProps) {
  const handleChange = (checked: boolean) => {
    if (props.onChange && !props.disabled) {
      props.onChange(checked)
    }
  }

  return (
    <BaseSwitch
      checked={props.checked}
      onChange={handleChange}
      disabled={props.disabled}
      class={clsx(props.class)}
    >
      <BaseSwitch.Input class='sr-only' />
      <BaseSwitch.Control
        class={clsx(
          'relative inline-flex shrink-0 w-8 h-5 rounded-full cursor-pointer',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-border-primary focus-visible:ring-offset-1',
          'focus-visible:ring-offset-background-page',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'bg-background-neutral-faded',
          'data-checked:bg-background-primary'
        )}
      >
        <BaseSwitch.Thumb
          class={clsx(
            'pointer-events-none absolute top-0.5 left-0.5',
            'w-4 h-4 rounded-full bg-white shadow-sm',
            'transform transition-transform duration-200 ease-in-out',
            'data-checked:translate-x-3'
          )}
        />
      </BaseSwitch.Control>
    </BaseSwitch>
  )
}
