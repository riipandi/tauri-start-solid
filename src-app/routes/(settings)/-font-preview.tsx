import { clsx } from 'clsx'

interface FontPreviewProps {
  family: string
  size: number
  text: string
  isMonospace?: boolean
  class?: string
}

export function FontPreview(props: FontPreviewProps) {
  return (
    <div
      style={`
        font-family: ${props.family};
        font-size: ${props.size}px;
        ${props.isMonospace ? 'font-feature-settings: "liga" 0;' : ''}
      `}
      class={clsx(
        'mt-3 p-4 rounded-lg border border-border-neutral',
        'bg-background-neutral-faded',
        props.class
      )}
    >
      <div class='mb-2 text-xs font-semibold text-foreground-neutral-faded uppercase tracking-wide'>
        Preview
      </div>
      <div class='text-sm leading-relaxed'>{props.text}</div>
      <div class='text-xs text-foreground-neutral-faded mt-2 font-mono'>
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 !@#$%&*()
      </div>
    </div>
  )
}
