import { createFileRoute } from '@tanstack/solid-router'
import settingService from '#/services/settings.service'

export const Route = createFileRoute('/(primary)/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main class='mx-auto my-0 w-full'>
      <div class='rounded-3xl py-12 px-8 max-w-125 w-full mt-[20vh] mx-auto'>
        <h1 class='text-4xl font-bold mb-6 text-center text-foreground-neutral'>
          Tauri Application
        </h1>
        <div class='flex gap-6 justify-center flex-wrap'>
          <p class='text-center leading-7'>
            This screen is intended to be simple as possible. <br />
            To see the invoke command in action, open the settings.
          </p>
          <div class='space-x-4'>
            <button
              type='button'
              onClick={settingService.openWindow}
              class='px-4 py-2 rounded-full border border-border-neutral bg-background-page/50 text-sm font-semibold text-foreground-neutral hover:border-foreground-neutral/35'
            >
              Open Settings
            </button>
            <a
              href='/404'
              class='px-4 py-2 rounded-full border border-border-neutral bg-background-page/50 text-sm font-semibold text-foreground-neutral hover:border-foreground-neutral/35'
            >
              404 Example
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
