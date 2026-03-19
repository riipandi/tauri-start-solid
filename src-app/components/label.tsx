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
      class={clsx('font-medium text-[13px] text-foreground-neutral', props.class)}
    >
      {props.label}

      <Show when={props.required}>
        <span class='text-critical ml-0.5'>*</span>
      </Show>

      <Show when={props.description}>
        <span class='block text-[11px] text-foreground-neutral-faded mt-0.5 font-normal'>
          {props.description}
        </span>
      </Show>
    </label>
  )
}
