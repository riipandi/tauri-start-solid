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
    <div className="flex flex-col size-full justify-between pb-2">
      <section className="space-y-5">
        <div className="flex flex-1 justify-between items-center">
          <div className="w-2/3 pr-2">
            <h2 className="text-base font-semibold leading-6 dark:text-white">Automatic Updates</h2>
            <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
              Check for updates automatically.
            </p>
          </div>

          <div className="w-1/3 flex flex-1 items-center">
            <div className="flex items-center w-full justify-end">
              <input
                type="checkbox"
                id="minimize-to-tray"
                className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
              />
              <label htmlFor="minimize-to-tray" className="sr-only">
                Automatic Updates
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-between items-center">
          <div className="w-2/3 pr-2">
            <h2 className="text-base font-semibold leading-6 dark:text-white">
              Updat to Beta Release
            </h2>
            <p className="mt-1 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
              Update to Beta Release, even though they maybe unstable.
            </p>
          </div>

          <div className="w-1/3 flex flex-1 items-center">
            <div className="flex items-center w-full justify-end">
              <input
                type="checkbox"
                id="close-to-tray"
                className="relative w-[3.25rem] h-7 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-none checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:size-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-neutral-400 dark:checked:before:bg-blue-200"
              />
              <label htmlFor="close-to-tray" className="sr-only">
                Close to Tray Menu
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5 size-full">
        <div className="size-full items-center justify-center flex flex-col text-neutral-500 dark:text-neutral-300">
          <p className="text-base leading-5">Last checked: Today at 00:00</p>
          <p className="text-base leading-5">No updates available, you are up to date.</p>
          <div className="mt-5">
            <button
              type="button"
              className="rounded-md bg-neutral-900 py-1.5 px-3 text-sm text-white shadow-sm hover:bg-neutral-700 block w-full"
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
