import { clsx } from 'clsx'
import { Show } from 'solid-js'

interface LabelProps {
  for?: string
  label: string
  description?: string
  required?: boolean
  class?: string
}

export function Label(props: LabelProps) {
  return (
    <label
      for={props.for}
      class={clsx('block mb-2 font-medium text-sm text-foreground-neutral', props.class)}
    >
      {props.label}

      <Show when={props.required}>
        <span class='text-critical ml-1'>*</span>
      </Show>

      <Show when={props.description}>
        <span class='block text-xs text-foreground-neutral-faded mt-1 font-normal'>
          {props.description}
        </span>
      </Show>
    </label>
  )
}
