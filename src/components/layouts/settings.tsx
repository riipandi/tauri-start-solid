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
      <div className="main-container rounded-top rounded-bottom">
        <div className="dark:bg-black disable-select flex flex-1">
          <aside className="fixed flex flex-col rounded-left w-48 pt-6 h-[99vh] overflow-y-auto bg-white border-r border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
            <div className="mt-4 mx-2">
              <h1 className="mx-2 text-base font-semibold dark:text-white">Settings</h1>
            </div>

            <div className="flex flex-col justify-between flex-1 p-3">
              <nav className="space-y-1 h-full mb-2">
                {primaryNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    className={clx(
                      pathname === item.href
                        ? 'text-neutral-700 dark:text-neutral-200 bg-neutral-200/60 dark:bg-neutral-900'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 hover:text-neutral-700',
                      'flex items-center px-3 py-2 transition-colors duration-75 transform rounded-md cursor-default tracking-tight'
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}

                <hr className="my-3 border-neutral-200 dark:border-neutral-600" />

                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    className={clx(
                      pathname === item.href
                        ? 'text-neutral-700 dark:text-neutral-200 bg-neutral-200/60 dark:bg-neutral-900'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 hover:text-neutral-700',
                      'flex items-center px-3 py-2 transition-colors duration-75 transform rounded-md cursor-default tracking-tight'
                    )}
                  >
                    <item.icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <button
                type="button"
                className="flex items-center px-3 py-2 text-neutral-600 transition-colors duration-75 transform rounded-md dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 hover:text-neutral-700"
                onClick={() =>
                  invoke('open_with_shell', {
                    url: 'https://github.com/riipandi/tauri-tray-app/issues',
                  })
                }
              >
                <LifeBuoyIcon className="size-4" strokeWidth={1.6} />
                <span className="mx-2 text-sm font-medium">Help &amp; Support</span>
              </button>
            </div>
          </aside>
          <main className="ml-48 px-4 pt-10 pb-4 dark:bg-dark-grey size-full dark:text-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
