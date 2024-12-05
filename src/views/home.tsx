import { useStore } from '@nanostores/solid'
import { invoke } from '@tauri-apps/api/core'
import { fetch } from '@tauri-apps/plugin-http'
import { Show, createEffect, createSignal, onMount } from 'solid-js'
import { Button } from '#/components/base-ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/base-ui/card'
import { TextField, TextFieldRoot } from '#/components/base-ui/textfield'
import { Link } from '#/components/link'
import { resetUiState, saveUiState, uiStore } from '#/stores/ui.store'

import viteLogo from '/vite.svg'
import solidLogo from '../assets/images/solid.svg'

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
    <div class="h-screen bg-slate-100 p-6 dark:bg-slate-900">
      <div class="mx-auto flex h-full max-w-2xl flex-col items-center justify-center py-24">
        <header class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <Link href="https://vite.dev" class="transition-transform hover:scale-110" newTab>
              <img src={viteLogo} class="h-8 w-8" alt="Vite logo" />
            </Link>
            <Link href="https://solidjs.com" class="transition-transform hover:scale-110" newTab>
              <img src={solidLogo} class="h-8 w-8" alt="Solid logo" />
            </Link>
            <h1 class="font-bold text-2xl text-slate-900 dark:text-white">Daily Quotes</h1>
          </div>
        </header>

        <main class="w-full flex-1 space-y-4">
          <Card>
            <CardHeader class="pb-2">
              <CardTitle>Personal Quote Collection</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
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
                  <p class="text-center text-slate-700 dark:text-slate-300">{greetMsg()}</p>
                </Show>
              </div>

              <div class="flex gap-3">
                <Button
                  onClick={() => saveUiState({ counter: uiState().counter + 1 })}
                  class="flex-1"
                >
                  Quote Number {uiState().counter}
                </Button>
                <Button onClick={() => resetUiState()} variant="outline" class="w-24">
                  Reset
                </Button>
              </div>

              <Show
                when={randomQuote()}
                fallback={
                  <div class="animate-pulse space-y-4 py-8">
                    <div class="mx-auto h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                    <div class="mx-auto h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                }
              >
                <div class="space-y-4 py-2">
                  <p class="text-center text-slate-700 italic dark:text-slate-300">
                    "{randomQuote()?.content}"
                  </p>
                  <p class="text-center text-slate-600 dark:text-slate-400">
                    — {randomQuote()?.author}
                  </p>
                </div>
              </Show>
            </CardContent>
          </Card>
        </main>

        <footer class="mt-4 text-center text-slate-600 text-sm dark:text-slate-400">
          <p>Share your favorite quotes with others</p>
        </footer>
      </div>
    </div>
  )
}
