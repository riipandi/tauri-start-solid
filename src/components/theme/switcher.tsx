import { Select, createListCollection } from '@ark-ui/solid/select'
import * as Lucide from 'lucide-solid'
import { type JSX, createEffect, createSignal } from 'solid-js'
import { Index, Portal } from 'solid-js/web'
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
    icon: (iconClass) => <Lucide.Sun class={iconClass} strokeWidth={1.8} />,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (iconClass) => <Lucide.Moon class={iconClass} strokeWidth={1.8} />,
  },
  {
    value: 'system',
    label: 'System',
    icon: (iconClass) => <Lucide.Monitor class={iconClass} strokeWidth={1.8} />,
  },
] as const

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const collection = createListCollection<ThemeOption>({ items: THEME_OPTIONS })
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
    try {
      if (!opts) return
      setSelectedTheme(opts)
      setTheme(opts.value)
    } catch (error) {
      console.error('Failed to change theme:', error)
    }
  }

  return (
    <Select.Root<ThemeOption>
      collection={collection}
      onValueChange={({ value }) => {
        const selectedOption = THEME_OPTIONS.find((opt) => opt.value === value[0])
        if (selectedOption) handleThemeChange(selectedOption)
      }}
      value={[selectedTheme().value]}
      positioning={{ placement: 'bottom-end' }}
    >
      <Select.Label class="sr-only">Theme</Select.Label>
      <Select.Control>
        <Select.Trigger
          aria-label="Select theme"
          class={clx(
            'inline-flex items-center justify-center rounded-md bg-transparent p-2 hover:bg-accent',
            'ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        >
          <Select.ValueText placeholder="Select theme" class="sr-only" />
          <Select.Indicator>
            <div class="transition-all duration-200 ease-in-out">
              {selectedTheme().icon(
                'size-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200'
              )}
            </div>
          </Select.Indicator>
        </Select.Trigger>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            class={clx(
              'z-50 min-w-[8rem] overflow-hidden rounded-md border-none bg-popover p-1',
              'text-popover-foreground shadow-md outline-none focus:outline-none focus:ring-0'
            )}
          >
            <Index each={collection.items}>
              {(item) => (
                <Select.Item item={item().value}>
                  <Select.ItemText
                    class={clx(
                      'relative flex w-full cursor-default select-none items-center gap-2',
                      'rounded-sm px-2 py-1.5 text-sm outline-none',
                      'transition-colors focus:bg-accent focus:text-accent-foreground',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                      item().value === theme() ? 'bg-accent/50' : 'hover:bg-accent/50'
                    )}
                  >
                    {item().icon('size-4')}
                    {item().label}
                  </Select.ItemText>
                </Select.Item>
              )}
            </Index>
          </Select.Content>
        </Select.Positioner>
      </Portal>
      <Select.HiddenSelect />
    </Select.Root>
  )
}
