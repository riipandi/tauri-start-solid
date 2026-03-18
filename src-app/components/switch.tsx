import { Switch as BaseSwitch } from '@kobalte/core/switch'
import { clsx } from 'clsx'
import { Show, splitProps } from 'solid-js'
import { Label } from './label'

interface SwitchProps {
  name?: string
  label?: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  class?: string
}

export function Switch(props: SwitchProps) {
  const [local, rest] = splitProps(props, ['label', 'description', 'class'])

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
      class={clsx('flex items-start gap-3', local.class)}
      {...rest}
    >
      <BaseSwitch.Input
        class={clsx(
          'relative inline-flex shrink-0 h-5 w-9',
          'border-2 border-transparent rounded-full cursor-pointer',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-page',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'data-checked:bg-primary',
          'data-unchecked:bg-background-neutral-faded'
        )}
      >
        <BaseSwitch.Control
          class={clsx(
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow',
            'transform transition-transform duration-200 ease-in-out',
            'translate-x-0 data-checked:translate-x-4'
          )}
        />
      </BaseSwitch.Input>

      <Show when={local.label}>
        <div class='flex flex-col'>
          <Label
            for={props.name}
            label={local.label!}
            description={local.description}
            class='mb-0 cursor-pointer'
          />
        </div>
      </Show>
    </BaseSwitch>
  )
}
