import { createFileRoute, Link } from '@tanstack/solid-router'
import { clsx } from 'clsx'
import { createSignal } from 'solid-js'
import { Button } from '#/components/button'
import demoService from '#/services/demo.service'
import { pageWrap } from '#/styles/layout.css'
import * as styles from '#/styles/screens/index.css'
import { textSelectable } from '#/styles/utils.css'

export const Route = createFileRoute('/(primary)/')({ component: App })

function App() {
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
      console.error('Greet error:', error)
      setGreetMsg('Error calling greet command')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main class={pageWrap}>
      <div class={styles.card}>
        <h1 class={clsx(styles.title, textSelectable)}>Tauri + SolidJS</h1>

        <form onSubmit={handleGreet} class={styles.greetForm}>
          <input
            class={styles.greetInput}
            type='text'
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder='Enter your name...'
          />
          <Button type='submit' disabled={isLoading() || !name()}>
            {isLoading() ? 'Sending...' : 'Greet'}
          </Button>
        </form>

        {greetMsg() && <div class={styles.response}>{greetMsg()}</div>}

        <div class={styles.navButtons}>
          <Link to='/settings'>
            <Button variant='primary'>Settings</Button>
          </Link>
          <a href='/404' class={styles.linkWrapper}>
            <Button variant='secondary'>404 Example</Button>
          </a>
        </div>
      </div>
    </main>
  )
}
