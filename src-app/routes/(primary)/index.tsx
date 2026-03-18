import { createFileRoute } from '@tanstack/solid-router'
import { Button } from '#/components/button'
import settingService from '#/services/settings.service'

export const Route = createFileRoute('/(primary)/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main class='mx-auto my-0 w-full'>
      <div class='rounded-3xl py-12 px-8 max-w-125 w-full mt-[20vh] mx-auto'>
        <h1 class='text-[2.5rem] font-bold mb-8 text-center text-foreground-neutral select-text'>
          Tauri Application
        </h1>
        <div class='flex gap-3 justify-center flex-wrap'>
          <button
            type='button'
            onClick={settingService.openWindow}
            class='px-5 py-2.5 rounded-full border border-border-neutral/20 bg-background-page/50 text-sm font-semibold text-foreground-neutral transition-all hover:-translate-y-0.5 hover:border-foreground-neutral/35 active:translate-y-0'
          >
            Settings
          </button>
          <a href='/404' class='inline-block text-decoration-none'>
            <Button variant='secondary'>404 Example</Button>
          </a>
        </div>
      </div>
    </main>
  )
}
