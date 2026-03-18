import { createFileRoute } from '@tanstack/solid-router'
import { consola } from 'consola'
import { createSignal } from 'solid-js'
import { Button } from '#/components/button'
import demoService from '#/services/demo.service'
import settingService from '#/services/settings.service'

export const Route = createFileRoute('/(primary)/')({
  component: RouteComponent
})

function RouteComponent() {
  const [name, setName] = createSignal('')
  const [greetMsg, setGreetMsg] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)

  async function handleGreet(e: Event) {
    e.preventDefault()
    if (!name()) return

    setIsLoading(true)
    try {
      const msg = await demoService.greet(name())
      setGreetMsg(msg)
    } catch (error) {
      consola.error('Greet error:', error)
      setGreetMsg('Error calling greet command')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main class='mx-auto my-0 w-full'>
      <div class='rounded-3xl py-12 px-8 max-w-125 w-full mt-[20vh] mx-auto'>
        <h1 class='text-[2.5rem] font-bold mb-8 text-center text-foreground-neutral select-text'>
          Tauri Application
        </h1>

        <form onSubmit={handleGreet} class='flex gap-3 w-full mb-6'>
          <input
            class='flex-1 py-3.5 px-4 rounded-lg border border-border-neutral bg-background-page/50 text-base text-foreground-neutral outline-none transition-all focus:border-primary focus:shadow-raised placeholder:text-foreground-neutral-faded'
            type='text'
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder='Enter your name...'
          />
          <Button type='submit' disabled={isLoading() || !name()}>
            {isLoading() ? 'Sending...' : 'Greet'}
          </Button>
        </form>

        {greetMsg() && (
          <div class='mt-0 mb-8 py-4 px-5 rounded-xl bg-linear-to-br from-background-page/95 to-background-page/80 border border-border-neutral text-base leading-relaxed text-foreground-neutral text-center shadow-raised'>
            {greetMsg()}
          </div>
        )}

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
