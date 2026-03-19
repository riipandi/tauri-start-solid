import { createFileRoute, Outlet, Link } from '@tanstack/solid-router'
import { createSignal, For, Show } from 'solid-js'
import { SettingsTitleBar } from './-title-bar'

export const Route = createFileRoute('/(settings)')({
  component: RouteComponent
})

const mainSettings = [
  {
    label: 'General',
    path: '/settings/general',
    keywords: ['general', 'preferences', 'settings', 'spell', 'check', 'reset']
  },
  {
    label: 'Appearance',
    path: '/settings/appearance',
    keywords: ['appearance', 'theme', 'dark', 'light', 'mode', 'color', 'accent']
  }
]

const otherSettings = [
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
        <nav class='w-48 shrink-0 border-r border-border-neutral bg-background-page/50 flex flex-col'>
          <div class='pt-1 pb-3 px-2 shrink-0'>
            <div class='relative'>
              <input
                type='text'
                placeholder='Search settings'
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class='w-full px-3 py-1.5 pr-8 border border-border-neutral rounded-md bg-background-page text-foreground-neutral text-sm focus:outline-none focus:ring-2 focus:ring-border-primary focus:border-border-primary placeholder:text-foreground-neutral-faded/60'
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
                          class='block py-1.5 px-2.5 rounded-md text-[13px] transition-colors text-foreground-neutral-faded hover:bg-background-neutral-faded hover:text-foreground-neutral'
                          activeProps={{
                            class: 'bg-background-primary/10 text-foreground-primary font-medium'
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
                          class='block py-1.5 px-2.5 rounded-md text-[13px] transition-colors text-foreground-neutral-faded hover:bg-background-neutral-faded hover:text-foreground-neutral'
                          activeProps={{
                            class: 'bg-background-primary/10 text-foreground-primary font-medium'
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
