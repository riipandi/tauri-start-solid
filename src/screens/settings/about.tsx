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
    <div className="flex flex-col size-full">
      <section className="-mt-4">
        <div className="flex flex-1 relative -mx-3 -my-4">
          <img src={AppBannerSvg} className="size-full" alt="App Banner" />
          <div className="bg-transparent size-full absolute" data-tauri-drag-region />
        </div>
        <div className="flex flex-col justify-center mt-8 text-sm text-center gap-1">
          <span className="text-neutral-600 dark:text-neutral-300 font-medium tracking-normal">{`${appName} v${appVersion} / Tauri v${tauriVersion}`}</span>
          <span className="text-neutral-600 dark:text-neutral-300 font-medium tracking-tight">
            Copyright © {new Date().getFullYear()} Your Company. All rights reserved.
          </span>
        </div>
      </section>

      <hr className="my-4 border-neutral-200 dark:border-neutral-600" />

      <section className="size-full">
        <textarea
          className="size-full focus:outline-none rounded text-base py-1 px-2 resize-none border-neutral-200 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 custom-scrollbar"
          value="License information will be displayed here."
          readOnly
        />
      </section>
    </div>
  )
}
