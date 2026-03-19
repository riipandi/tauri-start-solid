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
      <BaseSwitch.Input
        class={clsx(
          'relative inline-flex shrink-0 w-8 h-5',
          'border-2 border-transparent rounded-full cursor-pointer',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-1 focus:ring-offset-background-page',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'data-checked:bg-background-primary',
          'data-unchecked:bg-background-neutral-faded'
        )}
      >
        <BaseSwitch.Control
          class={clsx(
            'pointer-events-none absolute top-0.5 left-0.5',
            'w-4 h-4 rounded-full bg-on-background-primary shadow-sm',
            'transform transition-transform duration-200 ease-in-out',
            'data-checked:translate-x-3'
          )}
        />
      </BaseSwitch.Input>
    </BaseSwitch>
  )
}