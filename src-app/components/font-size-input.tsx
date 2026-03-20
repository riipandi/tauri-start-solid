import { clsx } from 'clsx'
import { Button } from './button'

interface FontSizeInputProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
  step?: number
}

export function FontSizeInput(props: FontSizeInputProps) {
  const min = props.min ?? 10
  const max = props.max ?? 24
  const step = props.step ?? 1

  const handleDecrease = () => {
    const newValue = Math.max(min, props.value - step)
    if (newValue !== props.value) {
      props.onChange(newValue)
    }
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, props.value + step)
    if (newValue !== props.value) {
      props.onChange(newValue)
    }
  }

  const handleInputChange = (e: Event & { currentTarget: HTMLInputElement }) => {
    const target = e.currentTarget
    const newValue = parseInt(target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      props.onChange(newValue)
    }
  }

  return (
    <div class='flex items-center gap-1'>
      <Button
        variant='secondary'
        onClick={handleDecrease}
        disabled={props.disabled || props.value <= min}
        class='px-2'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          class='w-4 h-4'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <title>Decrease font size</title>
          <path
            fill-rule='evenodd'
            d='M3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z'
            clip-rule='evenodd'
          />
        </svg>
      </Button>

      <input
        type='number'
        value={props.value}
        onInput={handleInputChange}
        disabled={props.disabled}
        min={min}
        max={max}
        step={step}
        class={clsx(
          'w-16 px-2 py-1 text-center text-sm border rounded-md',
          'bg-background-page border-border-neutral',
          'focus:outline-none focus:ring-1 focus:ring-border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      />

      <span class='text-xs text-foreground-neutral-faded px-1'>px</span>

      <Button
        variant='secondary'
        onClick={handleIncrease}
        disabled={props.disabled || props.value >= max}
        class='px-2'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          class='w-4 h-4'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <title>Increase font size</title>
          <path
            fill-rule='evenodd'
            d='M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3z'
            clip-rule='evenodd'
          />
          <path
            fill-rule='evenodd'
            d='M3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z'
            clip-rule='evenodd'
          />
        </svg>
      </Button>
    </div>
  )
}
