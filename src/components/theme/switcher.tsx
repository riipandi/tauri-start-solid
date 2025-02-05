import * as Lucide from 'lucide-solid'
import { type JSX, createEffect, createSignal } from 'solid-js'
import { Select } from '#/components/base-ui'
import { useTheme } from '#/context/hooks/use-theme'
import { Theme } from '#/libs/bindings'
import { clx } from '#/libs/utils'

interface ThemeOption {
  value: Theme
  label: string
  icon: (iconClass: string) => JSX.Element
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (iconClass: string) => <Lucide.Sun class={iconClass} strokeWidth={1.8} />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (iconClass: string) => <Lucide.Moon class={iconClass} strokeWidth={1.8} />,
  },
  {
    value: 'system',
    label: 'System',
    icon: (iconClass: string) => <Lucide.Monitor class={iconClass} strokeWidth={1.8} />,
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = createSignal<ThemeOption>(
    THEME_OPTIONS.find((opt) => opt.value === theme()) ?? THEME_OPTIONS[0]
  )

  // Sync theme changes with selected option
  createEffect(() => {
    const currentTheme = theme()
    const matchingOption = THEME_OPTIONS.find((opt) => opt.value === currentTheme)
    if (matchingOption) {
      setSelectedTheme(matchingOption)
    }
  })

  const handleThemeChange = (opts: ThemeOption | null) => {
    if (!opts) return
    setSelectedTheme(opts)
    setTheme(opts.value)
  }

  return (
    <Select<ThemeOption>
      options={THEME_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      value={selectedTheme()}
      onChange={handleThemeChange}
      gutter={4}
      sameWidth={false}
      placement="bottom-end"
      itemComponent={(props) => (
        <Select.Item
          item={props.item}
          class={clx(
            props.item.rawValue.value === theme() ? 'bg-accent' : '',
            'my-0.5 flex cursor-default items-center space-x-2 rounded-sm px-3 py-1',
            'text-sm outline-none transition-colors hover:bg-accent'
          )}
        >
          {props.item.rawValue.icon('size-4')}
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
        </Select.Item>
      )}
    >
      <Select.Trigger
        aria-label="toggle color mode"
        class={clx(
          'flex cursor-pointer items-center justify-center rounded-sm p-2 text-muted-foreground',
          'transition hover:bg-accent hover:text-accent-foreground focus:outline-none'
        )}
      >
        <Select.Value<ThemeOption>>{(state) => state.selectedOption().icon('size-5')}</Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="z-30 select-none rounded-md border border-border bg-popover p-1 text-foreground shadow-md">
          <Select.Listbox />
        </Select.Content>
      </Select.Portal>
    </Select>
  )
}
