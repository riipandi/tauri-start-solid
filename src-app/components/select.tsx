import * as BaseSelect from '@kobalte/core/select'
import { clsx } from 'clsx'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  name?: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (value: SelectOption | null) => void
  disabled?: boolean
  required?: boolean
  class?: string
}

export function Select(props: SelectProps) {
  const findOption = (val: string | undefined) => {
    return props.options.find((opt) => opt.value === val)
  }

  return (
    <BaseSelect.Root<SelectOption>
      options={props.options}
      optionValue={(option) => option.value}
      optionTextValue={(option) => option.label}
      placeholder={props.placeholder ?? 'Select...'}
      value={findOption(props.value) ?? null}
      onChange={props.onChange}
      disabled={props.disabled}
      itemComponent={(itemProps) => (
        <BaseSelect.Item
          item={itemProps.item}
          class={clsx(
            'flex items-center justify-between py-1.5 px-2.5 text-[13px]',
            'focus:outline-none focus:bg-background-neutral-faded',
            'cursor-pointer select-none',
            'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
            'data-focused:bg-background-primary/10 text-foreground-primary'
          )}
        >
          <BaseSelect.ItemLabel class='flex-1'>
            {itemProps.item.rawValue.label}
          </BaseSelect.ItemLabel>
          <BaseSelect.ItemIndicator class='ml-2'>
            <svg class='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
              <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' />
            </svg>
          </BaseSelect.ItemIndicator>
        </BaseSelect.Item>
      )}
      class={props.class}
    >
      <BaseSelect.HiddenSelect name={props.name} required={props.required} />

      <BaseSelect.Trigger
        class={clsx(
          'py-1.5 px-2.5 min-w-[140px]',
          'rounded-md border border-border-neutral',
          'bg-background-page text-foreground-neutral text-[13px]',
          'focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-1 focus:ring-offset-background-page',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'flex items-center justify-between gap-2'
        )}
      >
        <BaseSelect.Value<SelectOption>>
          {(state) => state.selectedOption()?.label ?? props.placeholder ?? 'Select...'}
        </BaseSelect.Value>

        <BaseSelect.Icon class='shrink-0'>
          <svg class='w-3.5 h-3.5 text-foreground-neutral-faded' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' />
          </svg>
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Content
          class={clsx(
            'z-50 w-full mt-1 py-0.5',
            'rounded-md border border-border-neutral bg-background-page',
            'shadow-raised max-h-60 overflow-auto'
          )}
        >
          <BaseSelect.Listbox class='list-none p-0 m-0 outline-none' />
        </BaseSelect.Content>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}