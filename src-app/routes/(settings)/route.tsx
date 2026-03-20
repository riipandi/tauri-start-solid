import { createFileRoute, Outlet, Link, type LinkProps } from '@tanstack/solid-router'
import { clsx } from 'clsx'
import { createSignal, For, Show } from 'solid-js'
import { SettingsTitleBar } from './-title-bar'

interface NavigationLinks extends LinkProps {
  label: string
  path: LinkProps['to']
  keywords: string[]
}

export const Route = createFileRoute('/(settings)')({
  component: RouteComponent
})

const mainSettings: NavigationLinks[] = [
  {
    label: 'General',
    path: '/settings/general',
    keywords: ['general', 'preferences', 'settings', 'spell', 'check', 'reset']
  },
  {
    label: 'Appearance',
    path: '/settings/appearance',
    keywords: ['appearance', 'theme', 'dark', 'light', 'mode', 'color', 'accent']
  },
  {
    label: 'Updates',
    path: '/settings/updates',
    keywords: ['updates', 'update', 'channel', 'beta', 'stable', 'version', 'automatic', 'manual']
  }
]

const otherSettings: NavigationLinks[] = [
  {
    label: 'About',
    path: '/settings/about',
    keywords: ['about', 'info', 'version', 'app', 'application', 'license']
  }
]

function RouteComponent() {
  const [searchQuery, setSearchQuery] = createSignal('')

  const filterItems = (items: typeof mainSettings) => {
    const query = searchQuery().toLowerCase().trim()
    if (!query) return items
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.keywords.some((keyword) => keyword.includes(query))
    )
  }

  const filteredMainItems = () => filterItems(mainSettings)
  const filteredOtherItems = () => filterItems(otherSettings)
  const hasResults = () => filteredMainItems().length > 0 || filteredOtherItems().length > 0

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div class='flex flex-col h-screen'>
      <SettingsTitleBar />
      <div class='flex flex-1 overflow-hidden'>
        <nav class='w-48 shrink-0 border-r border-border-neutral bg-background-neutral-faded flex flex-col'>
          <div class='pt-1 pb-3 px-2 shrink-0'>
            <div class='relative px-1'>
              <input
                type='text'
                placeholder='Search settings'
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class={clsx(
                  'w-full px-3 py-1.5 pr-8 border border-border-neutral rounded-xs bg-background-page text-foreground-neutral text-sm',
                  'focus:outline-none focus:ring-1 focus:ring-border-primary focus:border-border-primary placeholder:text-foreground-neutral-faded/60'
                )}
              />
              <Show when={searchQuery()}>
                <button
                  type='button'
                  onClick={handleClear}
                  class='absolute right-2 top-1/2 -translate-y-1/2 text-foreground-neutral-faded hover:text-foreground-neutral transition-colors'
                  aria-label='Clear search'
                  title='Clear search'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    class='w-4 h-4'
                    role='img'
                    aria-hidden='true'
                  >
                    <title>Clear search</title>
                    <path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
                  </svg>
                </button>
              </Show>
            </div>
          </div>
          <div class='pb-3 px-2 flex-1 flex flex-col'>
            <Show when={!hasResults()}>
              <div class='py-8 text-center text-foreground-neutral-faded text-xs'>
                No results found
              </div>
            </Show>

            <Show when={hasResults()}>
              <Show when={filteredMainItems().length > 0}>
                <ul class='space-y-0.5'>
                  <For each={filteredMainItems()}>
                    {(item) => (
                      <li>
                        <Link
                          to={item.path}
                          class='block py-1.5 px-2.5 rounded-md text-[13px] text-foreground-neutral hover:bg-background-neutral-faded hover:text-foreground-primary'
                          activeProps={{
                            class: 'text-foreground-primary hover:text-foreground-primary'
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>

              <Show when={filteredMainItems().length > 0 && filteredOtherItems().length > 0}>
                <div class='my-2 border-t border-border-neutral' />
              </Show>

              <Show when={filteredOtherItems().length > 0}>
                <ul class='space-y-0.5'>
                  <For each={filteredOtherItems()}>
                    {(item) => (
                      <li>
                        <Link
                          to={item.path}
                          class='block py-1.5 px-2.5 rounded-md text-[13px] text-foreground-neutral hover:bg-background-neutral-faded hover:text-foreground-primary'
                          activeProps={{
                            class: 'text-foreground-primary hover:text-foreground-primary'
                          }}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )}
                  </For>
                </ul>
              </Show>
            </Show>
          </div>
        </nav>
        <main class='flex-1 overflow-y-auto overflow-x-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
