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
      <div className="flex flex-col size-full justify-between pb-2">
        <div className="flex flex-col size-full justify-start">
          <section className="space-y-5">
            <div className="flex flex-1 justify-between space-x-4">
              <div className="w-2/3 pr-2">
                <h2 className="text-base font-semibold leading-6 dark:text-white">Theme</h2>
                <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                  Select your preferred theme.
                </p>
              </div>

              <div className="w-1/3 flex flex-1 justify-between items-center">
                <div className="flex overflow-hidden h-8 w-full bg-white border border-neutral-200 divide-x divide-neutral-200 rounded-md dark:bg-neutral-900 dark:border-neutral-700 dark:divide-neutral-700 shadow-sm">
                  <button
                    type="button"
                    className={clx(
                      newTheme === Theme.Auto
                        ? 'bg-blue-dark dark:bg-blue-dark dark:text-neutral-100 text-neutral-100'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
                      'inline-flex justify-center w-full items-center transition-colors duration-75'
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
                        ? 'bg-blue-dark dark:bg-blue-dark dark:text-neutral-100 text-neutral-100'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
                      'inline-flex justify-center w-full items-center transition-colors duration-75'
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
                        ? 'bg-blue-dark dark:bg-blue-dark dark:text-neutral-100 text-neutral-100'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300',
                      'inline-flex justify-center w-full items-center transition-colors duration-75'
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
                <h2 className="text-base font-semibold leading-6 dark:text-white">Zoom Factor</h2>
                <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                  Controls the overall zoom level of the application.
                </p>
              </div>

              <div className="w-1/3 flex flex-1 items-center">
                <div className="h-8 inline-block border border-neutral-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
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
            <div className="flex flex-1 justify-between items-center">
              <div className="w-2/3 pr-2">
                <h2 className="text-base font-semibold leading-6 dark:text-white">
                  Minimize to Tray Menu
                </h2>
                <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                  Minimize the application to the tray menu.
                </p>
              </div>

              <div className="w-1/3 flex flex-1 items-center">
                <div className="flex items-center w-full justify-end">
                  <input
                    type="checkbox"
                    id={minimizeToTrayId}
                    className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
                  />
                  <label htmlFor={minimizeToTrayId} className="sr-only">
                    Minimize to Tray Menu
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-between items-center">
              <div className="w-2/3 pr-2">
                <h2 className="text-base font-semibold leading-6 dark:text-white">
                  Close to Tray Menu
                </h2>
                <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                  Close the application to the tray menu.
                </p>
              </div>

              <div className="w-1/3 flex flex-1 items-center">
                <div className="flex items-center w-full justify-end">
                  <input
                    type="checkbox"
                    id={closeToTrayId}
                    className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
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
          <div className="flex flex-1 justify-between items-center">
            <div className="w-2/3 pr-2">
              <h2 className="text-base font-semibold leading-6 dark:text-white">Reset Settings</h2>
              <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                Reset all settings to their default values. <br />
                This action is not reversible.
              </p>
            </div>

            <div className="w-1/3 flex flex-1 items-center">
              <div className="w-full">
                <button
                  type="button"
                  className="rounded-md bg-red-500 py-1.5 px-3 text-sm text-white shadow-sm hover:bg-red-400 block w-full"
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
