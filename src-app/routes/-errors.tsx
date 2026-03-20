import { useCanGoBack, useRouter } from '@tanstack/solid-router'
import { clsx } from 'clsx'

export function GlobalNotFound() {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const handleBack = () => {
    if (canGoBack()) {
      router.history.back()
    } else {
      router.navigate({ href: '/' })
    }
  }

  return (
    <div class='relative min-h-screen bg-background-page'>
      <div
        class='flex items-center justify-between w-full relative z-50 select-none shrink-0 h-9.5 bg-transparent'
        data-tauri-drag-region
      ></div>

      {/* Decorative gradient */}
      <div class='absolute inset-0 overflow-hidden'>
        <div class='-inset-2.5 absolute opacity-50'>
          <div class='absolute top-0 h-160 w-full bg-linear-to-b from-background-primary/30 via-transparent to-transparent' />
        </div>
      </div>

      <div class='relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 pb-32 sm:px-6 lg:px-8'>
        {/* 404 Content */}
        <div class='text-center'>
          <p class='font-bold text-2xl text-on-background-primary'>404</p>
          <h1 class='mt-4 font-bold text-3xl text-white tracking-tight sm:text-5xl'>
            Page not found
          </h1>
          <p class='mt-6 text-base text-foreground-neutral leading-7'>
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div class='mt-8 flex items-center justify-center gap-x-4'>
            <button
              type='button'
              class={clsx(
                'min-w-40 rounded bg-background-primary px-5 py-2.5 font-semibold text-on-background-primary text-sm duration-200',
                'hover:bg-background-primary/80 focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-2 focus:ring-offset-border-primary-faded'
              )}
              onClick={handleBack}
            >
              Go back
            </button>
          </div>
        </div>

        {/* Decorative 404 background */}
        <div class='pointer-events-none absolute select-none'>
          <h2 class='font-bold text-[20rem] text-foreground-primary/5'>404</h2>
        </div>
      </div>
    </div>
  )
}
