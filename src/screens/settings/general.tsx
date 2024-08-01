import { Suspense, useEffect, useId, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { confirm, message } from '@tauri-apps/plugin-dialog'
import { LightbulbIcon, MonitorDotIcon, MoonStarIcon } from 'lucide-react'

import { useAppSettings } from '@/hooks/useAppSettings'
import { NumberInput } from '@/components/elements/input'
import PageLoader from '@/components/loader'
import { clx } from '@/utils/helpers'
import { Theme } from '@/types/bindings'

export function SettingGeneral() {
  const { theme, zoom_factor, saveSetting } = useAppSettings()
  const [newTheme, setNewTheme] = useState<Theme | undefined>(theme)
  const [newZoomFactor, setNewZoomFactor] = useState<number>(zoom_factor ?? 1)

  const minimizeToTrayId = useId()
  const closeToTrayId = useId()

  const handleSwitchTheme = async (theme: Theme) => {
    await invoke('set_theme', { theme }).then(() => {
      const editorTheme = newTheme === Theme.Light ? 'vs-light' : 'vs-dark'
      saveSetting('code_editor_theme', editorTheme)
      setNewTheme(theme)
    })
  }

  const handleSetZoomFactor = async (zoomFactor: string) => {
    const newZoomFactor = Number(zoomFactor)
    saveSetting('zoom_factor', newZoomFactor).then(() => setNewZoomFactor(newZoomFactor))
  }

  const handleResetSettings = async () => {
    const dialogTitle = 'Reset Application Settings'
    const confirmation = await confirm('This action cannot be reverted. Are you sure?', {
      title: dialogTitle,
      kind: 'warning',
    })

    if (!confirmation) return

    await message('Application has been reset to default settings.', {
      title: dialogTitle,
      kind: 'info',
    })
  }

  useEffect(() => {
    const handleOnMount = async () => {
      setNewTheme(theme === 'light' ? Theme.Light : theme === 'dark' ? Theme.Dark : Theme.Auto)
      setNewZoomFactor(newZoomFactor)
    }
    handleOnMount()
  }, [theme, newZoomFactor])

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex size-full flex-col justify-between pb-2">
        <div className="flex size-full flex-col justify-start">
          <section className="space-y-5">
            <div className="flex flex-1 justify-between space-x-4">
              <div className="w-2/3 pr-2">
                <h2 className="font-semibold text-base leading-6 dark:text-white">Theme</h2>
                <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                  Select your preferred theme.
                </p>
              </div>

              <div className="flex w-1/3 flex-1 items-center justify-between">
                <div className="flex h-8 w-full divide-x divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 bg-white shadow-sm dark:divide-neutral-700 dark:border-neutral-700 dark:bg-neutral-900">
                  <button
                    type="button"
                    className={clx(
                      newTheme === Theme.Auto
                        ? 'bg-blue-dark text-neutral-100 dark:bg-blue-dark dark:text-neutral-100'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                      'inline-flex w-full items-center justify-center transition-colors duration-75'
                    )}
                    onClick={() => handleSwitchTheme(Theme.Auto)}
                  >
                    <MonitorDotIcon className="size-4" strokeWidth={1.6} />
                    <span className="sr-only">Auto</span>
                  </button>

                  <button
                    type="button"
                    className={clx(
                      newTheme === Theme.Light
                        ? 'bg-blue-dark text-neutral-100 dark:bg-blue-dark dark:text-neutral-100'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                      'inline-flex w-full items-center justify-center transition-colors duration-75'
                    )}
                    onClick={() => handleSwitchTheme(Theme.Light)}
                  >
                    <LightbulbIcon className="size-4" strokeWidth={1.6} />
                    <span className="sr-only">Light</span>
                  </button>

                  <button
                    type="button"
                    className={clx(
                      newTheme === Theme.Dark
                        ? 'bg-blue-dark text-neutral-100 dark:bg-blue-dark dark:text-neutral-100'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                      'inline-flex w-full items-center justify-center transition-colors duration-75'
                    )}
                    onClick={() => handleSwitchTheme(Theme.Dark)}
                  >
                    <MoonStarIcon className="size-4" strokeWidth={1.6} />
                    <span className="sr-only">Dark</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-between space-x-4">
              <div className="w-2/3 pr-2">
                <h2 className="font-semibold text-base leading-6 dark:text-white">Zoom Factor</h2>
                <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                  Controls the overall zoom level of the application.
                </p>
              </div>

              <div className="flex w-1/3 flex-1 items-center">
                <div className="inline-block h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900">
                  <NumberInput
                    defaultValue={newZoomFactor}
                    onChange={({ currentTarget }: any) => handleSetZoomFactor(currentTarget.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="my-6 border-neutral-200 dark:border-neutral-600" />

          <section className="space-y-5">
            <div className="flex flex-1 items-center justify-between">
              <div className="w-2/3 pr-2">
                <h2 className="font-semibold text-base leading-6 dark:text-white">
                  Minimize to Tray Menu
                </h2>
                <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                  Minimize the application to the tray menu.
                </p>
              </div>

              <div className="flex w-1/3 flex-1 items-center">
                <div className="flex w-full items-center justify-end">
                  <input
                    type="checkbox"
                    id={minimizeToTrayId}
                    className="relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:size-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-blue-600 checked:bg-none checked:text-blue-600 checked:before:translate-x-full checked:before:bg-blue-200 focus:ring-blue-600 focus:checked:border-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-offset-gray-600 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                  />
                  <label htmlFor={minimizeToTrayId} className="sr-only">
                    Minimize to Tray Menu
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div className="w-2/3 pr-2">
                <h2 className="font-semibold text-base leading-6 dark:text-white">
                  Close to Tray Menu
                </h2>
                <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                  Close the application to the tray menu.
                </p>
              </div>

              <div className="flex w-1/3 flex-1 items-center">
                <div className="flex w-full items-center justify-end">
                  <input
                    type="checkbox"
                    id={closeToTrayId}
                    className="relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:size-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-blue-600 checked:bg-none checked:text-blue-600 checked:before:translate-x-full checked:before:bg-blue-200 focus:ring-blue-600 focus:checked:border-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-offset-gray-600 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                    defaultChecked
                  />
                  <label htmlFor={closeToTrayId} className="sr-only">
                    Close to Tray Menu
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="space-y-5">
          <div className="flex flex-1 items-center justify-between">
            <div className="w-2/3 pr-2">
              <h2 className="font-semibold text-base leading-6 dark:text-white">Reset Settings</h2>
              <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
                Reset all settings to their default values. <br />
                This action is not reversible.
              </p>
            </div>

            <div className="flex w-1/3 flex-1 items-center">
              <div className="w-full">
                <button
                  type="button"
                  className="block w-full rounded-md bg-red-500 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-red-400"
                  onClick={handleResetSettings}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  )
}
