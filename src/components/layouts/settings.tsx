import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'
import {
  BoltIcon,
  CircleHelpIcon,
  GlassesIcon,
  KeyboardIcon,
  LifeBuoyIcon,
  RefreshCcwDotIcon,
  SwatchBookIcon,
} from 'lucide-react'

import { DefaultTitleBar } from '@/components/titlebar'
import { clx } from '@/utils/helpers'

const primaryNavItems = [
  {
    id: 'general',
    href: '/settings',
    label: 'General',
    icon: BoltIcon,
  },
  {
    id: 'appearance',
    href: '/settings/appearance',
    label: 'Appearance',
    icon: SwatchBookIcon,
  },
  {
    id: 'updates',
    href: '/settings/updates',
    label: 'Updates',
    icon: RefreshCcwDotIcon,
  },
]

const secondaryNavItems = [
  {
    id: 'shortcuts',
    href: '/settings/shortcuts',
    label: 'Keyboard Shortcuts',
    icon: KeyboardIcon,
  },
  {
    id: 'changelog',
    href: '/settings/changelog',
    label: `What's new?`,
    icon: GlassesIcon,
  },
  {
    id: 'about',
    href: '/settings/about',
    label: 'About',
    icon: CircleHelpIcon,
  },
]

export function SettingsLayout() {
  const { pathname } = useLocation()

  return (
    <div className="root-settings">
      <DefaultTitleBar />
      <div className="main-container rounded-bottom rounded-top">
        <div className="disable-select flex flex-1 dark:bg-black">
          <aside className="fixed flex h-[99vh] w-48 flex-col overflow-y-auto rounded-left border-neutral-200 border-r bg-white pt-6 dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mx-2 mt-4">
              <h1 className="mx-2 font-semibold text-base dark:text-white">Settings</h1>
            </div>

            <div className="flex flex-1 flex-col justify-between p-3">
              <nav className="mb-2 h-full space-y-1">
                {primaryNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    className={clx(
                      pathname === item.href
                        ? 'bg-neutral-200/60 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200',
                      'flex transform cursor-default items-center rounded-md px-3 py-2 tracking-tight transition-colors duration-75'
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    <span className="mx-2 font-medium text-sm">{item.label}</span>
                  </NavLink>
                ))}

                <hr className="my-3 border-neutral-200 dark:border-neutral-600" />

                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    className={clx(
                      pathname === item.href
                        ? 'bg-neutral-200/60 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200',
                      'flex transform cursor-default items-center rounded-md px-3 py-2 tracking-tight transition-colors duration-75'
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    <span className="mx-2 font-medium text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <button
                type="button"
                className="flex transform items-center rounded-md px-3 py-2 text-neutral-600 transition-colors duration-75 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                onClick={() =>
                  invoke('open_with_shell', {
                    url: 'https://github.com/riipandi/tauri-tray-app/issues',
                  })
                }
              >
                <LifeBuoyIcon className="size-4" strokeWidth={1.6} />
                <span className="mx-2 font-medium text-sm">Help &amp; Support</span>
              </button>
            </div>
          </aside>
          <main className="ml-48 size-full px-4 pt-10 pb-4 dark:bg-dark-grey dark:text-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
