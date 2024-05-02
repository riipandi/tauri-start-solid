import { Outlet } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'
import { CogIcon, PanelRightIcon } from 'lucide-react'

import { CustomTitleBar } from '@/components/titlebar'
import { clx } from '@/utils/helpers'

export function PrimaryLayout() {
  return (
    <div className="root-main">
      <CustomTitleBar>
        <div data-tauri-drag-region className="flex items-center gap-x-2">
          <button
            type="button"
            className={clx(
              'sr-only'
              // TODO : uncomment to enable this icon and remove `sr-only` class.
              // 'p-1 inline-flex items-center gap-x-2 text-sm rounded-full cursor-pointer',
              // 'bg-transparent disabled:opacity-50 disabled:pointer-events-none focus:outline-none'
            )}
          >
            <PanelRightIcon
              className="size-4 text-neutral-500 hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-neutral-400"
              strokeWidth={1.8}
            />
            <span className="sr-only">Settings</span>
          </button>
        </div>
        <div className="-ml-[72px] dark:text-neutral-100">
          <span data-tauri-drag-region>Tauri App</span>
        </div>
        <button
          type="button"
          onClick={async () => await invoke('open_settings_window')}
          className={clx(
            'p-1 inline-flex items-center gap-x-2 text-sm rounded-full cursor-pointer',
            'bg-transparent disabled:opacity-50 disabled:pointer-events-none focus:outline-none'
          )}
        >
          <CogIcon
            className="size-4 text-neutral-500 hover:text-neutral-600 dark:text-neutral-300 dark:hover:text-neutral-400"
            strokeWidth={1.8}
          />
          <span className="sr-only">Settings</span>
        </button>
      </CustomTitleBar>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  )
}
