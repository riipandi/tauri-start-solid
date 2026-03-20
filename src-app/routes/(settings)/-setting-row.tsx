import { clsx } from 'clsx'
import { Show, type JSXElement } from 'solid-js'

interface SettingRowProps {
  label: string
  description?: string
  children: JSXElement
  class?: string
}

export function SettingRow(props: SettingRowProps) {
  return (
    <div class={clsx('flex items-center gap-4 py-2', props.class)}>
      <div class='flex-1 min-w-0'>
        <div class='text-[13px] font-medium text-foreground-neutral'>{props.label}</div>
        <Show when={props.description}>
          <div class='text-[11px] text-foreground-neutral-faded mt-0.5'>{props.description}</div>
        </Show>
      </div>
      <div class='shrink-0'>{props.children}</div>
    </div>
  )
}
