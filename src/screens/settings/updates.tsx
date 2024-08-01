import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { message } from '@tauri-apps/plugin-dialog'

export function SettingUpdates() {
  const handleCheckForUpdates = async () => {
    try {
      const update = await check()

      if (!update || !update.available) {
        await message('Application is up to date.', {
          title: 'Update Check',
          kind: 'info',
        })
        return // No need to proceed further if no update available.
      }

      // Concurrently download and install the update.
      await Promise.all([
        update.downloadAndInstall(),
        message('Updating application...', { title: 'Update', kind: 'info' }),
      ])
      await relaunch()
    } catch (error) {
      // Handle error appropriately, show error message to the user.
      console.error('Error during update process:', error)
      await message(`Error during update process: ${error}`, {
        title: 'Update Check',
        kind: 'error',
      })
    }
  }

  return (
    <div className="flex size-full flex-col justify-between pb-2">
      <section className="space-y-5">
        <div className="flex flex-1 items-center justify-between">
          <div className="w-2/3 pr-2">
            <h2 className="font-semibold text-base leading-6 dark:text-white">Automatic Updates</h2>
            <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
              Check for updates automatically.
            </p>
          </div>

          <div className="flex w-1/3 flex-1 items-center">
            <div className="flex w-full items-center justify-end">
              <input
                type="checkbox"
                id="minimize-to-tray"
                className="relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:size-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-blue-600 checked:bg-none checked:text-blue-600 checked:before:translate-x-full checked:before:bg-blue-200 focus:ring-blue-600 focus:checked:border-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-offset-gray-600 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
              />
              <label htmlFor="minimize-to-tray" className="sr-only">
                Automatic Updates
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="w-2/3 pr-2">
            <h2 className="font-semibold text-base leading-6 dark:text-white">
              Updat to Beta Release
            </h2>
            <p className="mt-1 text-neutral-500 text-sm leading-4 dark:text-neutral-400">
              Update to Beta Release, even though they maybe unstable.
            </p>
          </div>

          <div className="flex w-1/3 flex-1 items-center">
            <div className="flex w-full items-center justify-end">
              <input
                type="checkbox"
                id="close-to-tray"
                className="relative h-7 w-[3.25rem] cursor-pointer rounded-full border-transparent bg-gray-100 p-px text-transparent transition-colors duration-200 ease-in-out before:inline-block before:size-6 before:translate-x-0 before:transform before:rounded-full before:bg-white before:shadow before:ring-0 before:transition before:duration-200 before:ease-in-out checked:border-blue-600 checked:bg-none checked:text-blue-600 checked:before:translate-x-full checked:before:bg-blue-200 focus:ring-blue-600 focus:checked:border-blue-600 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-offset-gray-600 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
              />
              <label htmlFor="close-to-tray" className="sr-only">
                Close to Tray Menu
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="size-full space-y-5">
        <div className="flex size-full flex-col items-center justify-center text-neutral-500 dark:text-neutral-300">
          <p className="text-base leading-5">Last checked: Today at 00:00</p>
          <p className="text-base leading-5">No updates available, you are up to date.</p>
          <div className="mt-5">
            <button
              type="button"
              className="block w-full rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-neutral-700"
              onClick={handleCheckForUpdates}
            >
              Check For Updates
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
