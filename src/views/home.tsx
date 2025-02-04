import { useStore } from '@nanostores/solid'
import { invoke } from '@tauri-apps/api/core'
import { fetch } from '@tauri-apps/plugin-http'
import { Show, createEffect, createSignal, onMount } from 'solid-js'
import { Button, Link, TextField, TextFieldRoot } from '#/components/base-ui'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/base-ui'
import { ThemeSwitcher } from '#/components/theme/switcher'
import { resetUiState, saveUiState, uiStore } from '#/stores/ui.store'

import solidLogo from '/images/solid.svg'
import viteLogo from '/images/vite.svg'

type Quotes = {
  author: string
  content: string
}[]

export default function Component() {
  const uiState = useStore(uiStore)
  const [quotes, setQuotes] = createSignal<Quotes>([])
  const [randomQuote, setRandomQuote] = createSignal<Quotes[0] | null>(null)
  const [greetMsg, setGreetMsg] = createSignal('')
  const [name, setName] = createSignal('')

  createEffect(() => {
    const allQuotes = quotes()
    if (allQuotes.length) {
      const index = uiState().counter % allQuotes.length
      setRandomQuote(allQuotes[index])
    }
  })

  onMount(async () => {
    try {
      const response = await fetch('https://i18n-quotes.victr.workers.dev/', { method: 'GET' })
      const allQuotes = (await response.json()) as Quotes
      setQuotes(allQuotes)
      setRandomQuote(allQuotes[uiState().counter % allQuotes.length])
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    }
  })

  async function greet() {
    setGreetMsg(await invoke('greet', { name: name() }))
  }

  return (
    <div class="flex min-h-full w-full flex-col items-center justify-center rounded-bl-[10px]">
      <div class="w-full max-w-xl p-4">
        <header class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Link href="https://vite.dev" class="transition-transform hover:scale-110" newTab>
              <img src={viteLogo} class="size-8" alt="Vite logo" />
            </Link>
            <Link href="https://solidjs.com" class="transition-transform hover:scale-110" newTab>
              <img src={solidLogo} class="size-8" alt="Solid logo" />
            </Link>
            <h1 class="font-bold text-2xl text-gray-900 dark:text-white">Daily Quotes</h1>
          </div>
          <ThemeSwitcher />
        </header>

        <div class="w-full flex-1 space-y-4">
          <Card>
            <CardHeader class="pb-2">
              <CardTitle>Personal Quote Collection</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <TextFieldRoot class="flex items-center gap-3 space-y-0">
                  <TextField
                    type="text"
                    placeholder="What's your name?"
                    value={name()}
                    onInput={(e) => setName(e.currentTarget.value)}
                    class="flex-1"
                  />
                  <Button onClick={greet}>Greet</Button>
                </TextFieldRoot>

                <Show when={greetMsg()}>
                  <p class="whitespace-pre-line break-words p-1 text-center text-gray-700 dark:text-gray-300">
                    {greetMsg()}
                  </p>
                </Show>
              </div>

              <div class="flex gap-3">
                <Button
                  onClick={() => saveUiState({ counter: uiState().counter + 1 })}
                  variant="outline"
                  class="flex-1"
                >
                  Quote Number {uiState().counter}
                </Button>
                <Button onClick={() => resetUiState()} variant="destructive" class="w-24">
                  Reset
                </Button>
              </div>

              <Show
                when={randomQuote()}
                fallback={
                  <div class="animate-pulse space-y-4 py-8">
                    <div class="mx-auto h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                    <div class="mx-auto h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                }
              >
                <div class="space-y-4 py-2">
                  <p class="text-center text-gray-700 italic dark:text-gray-300">
                    "{randomQuote()?.content}"
                  </p>
                  <p class="text-center text-gray-600 dark:text-gray-400">
                    — {randomQuote()?.author}
                  </p>
                </div>
              </Show>
            </CardContent>
          </Card>
        </div>

        <footer class="mt-4 text-center text-gray-600 text-sm dark:text-gray-400">
          <p>Share your favorite quotes with others</p>
        </footer>
      </div>
    </div>
  )
}
