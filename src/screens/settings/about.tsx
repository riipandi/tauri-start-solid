import { useEffect, useState } from 'react'
import { getName, getVersion, getTauriVersion } from '@tauri-apps/api/app'

import AppBannerSvg from '@/assets/images/app-banner.svg'

export function SettingAbout() {
  const [appName, setAppName] = useState<string>('')
  const [appVersion, setAppVersion] = useState<string>('')
  const [tauriVersion, setTauriVersion] = useState<string>('')

  useEffect(() => {
    getName().then((val) => setAppName(val))
    getVersion().then((val) => setAppVersion(val))
    getTauriVersion().then((val) => setTauriVersion(val))
  }, [])

  return (
    <div className="flex size-full flex-col">
      <section className="-mt-4">
        <div className="-mx-3 -my-4 relative flex flex-1">
          <img src={AppBannerSvg} className="size-full" alt="App Banner" />
          <div className="absolute size-full bg-transparent" data-tauri-drag-region />
        </div>
        <div className="mt-8 flex flex-col justify-center gap-1 text-center text-sm">
          <span className="font-medium text-neutral-600 tracking-normal dark:text-neutral-300">{`${appName} v${appVersion} / Tauri v${tauriVersion}`}</span>
          <span className="font-medium text-neutral-600 tracking-tight dark:text-neutral-300">
            Copyright © {new Date().getFullYear()} Your Company. All rights reserved.
          </span>
        </div>
      </section>

      <hr className="my-4 border-neutral-200 dark:border-neutral-600" />

      <section className="size-full">
        <textarea
          className="custom-scrollbar size-full resize-none rounded border-neutral-200 px-2 py-1 text-base focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          value="License information will be displayed here."
          readOnly
        />
      </section>
    </div>
  )
}
