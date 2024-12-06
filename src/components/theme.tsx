import type { ConfigColorMode } from '@kobalte/core/color-mode'
import { useColorMode } from '@kobalte/core/color-mode'
import * as Lucide from 'lucide-solid'
import { type JSX, createSignal, onMount } from 'solid-js'
import { Select } from '#/components/base-ui/select'
import { clx } from '#/libs/utils'

interface ThemeOption {
  value: ConfigColorMode
  label: string
  icon: (iconClass: string) => JSX.Element
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (iconClass: string) => <Lucide.Sun class={iconClass} />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (iconClass: string) => <Lucide.Moon class={iconClass} />,
  },
  {
    value: 'system',
    label: 'System',
    icon: (iconClass: string) => <Lucide.Monitor class={iconClass} />,
  },
]

export function ThemeSelector() {
  const { colorMode, setColorMode } = useColorMode()
  const [selectedTheme, setSelectedTheme] = createSignal<ThemeOption>()

  onMount(() => {
    // Use MaybeConfigColorMode to get value from custom storage
    setSelectedTheme(THEME_OPTIONS.find((option) => option.value === colorMode()))
  })

  const handleThemeChange = (opts: ThemeOption | null) => {
    if (opts) {
      setSelectedTheme(opts)
      setColorMode(opts.value)
    }
  }

  return (
    <Select<ThemeOption>
      options={THEME_OPTIONS}
      optionValue="value"
      optionTextValue="label"
      value={selectedTheme() ?? THEME_OPTIONS[0]}
      onChange={handleThemeChange}
      gutter={8}
      sameWidth={false}
      placement="bottom-end"
      itemComponent={(props) => (
        <Select.Item
          item={props.item}
          class={clx(
            props.item.rawValue.value === colorMode() ? 'bg-gray-100 dark:bg-gray-700' : '',
            'flex cursor-default items-center space-x-2 px-3 py-1 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {props.item.rawValue.icon('h-4 w-4')}
          <Select.ItemLabel>{props.item.rawValue.label}</Select.ItemLabel>
        </Select.Item>
      )}
    >
      <Select.Trigger
        aria-label="toggle color mode"
        class="flex cursor-pointer items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <Select.Value<ThemeOption>>
          {(state) => state.selectedOption().icon('h-5 w-5')}
        </Select.Value>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class="z-50 select-none rounded border border-gray-300 bg-white p-1 shadow-md dark:border-none dark:bg-gray-800 dark:text-gray-300 dark:shadow-none">
          <Select.Listbox />
        </Select.Content>
      </Select.Portal>
    </Select>
  )
}
