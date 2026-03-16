import { createFileRoute, Link } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import { For } from 'solid-js'
import demoService from '#/services/demo.service'
import { pageWrap, islandKicker, featureCard, riseIn } from '#/styles/layout.css'
import * as styles from '#/styles/screens/index.css'
import { sprinkles } from '#/styles/sprinkles.css'

export const Route = createFileRoute('/(primary)/')({ component: App })

function App() {
  const [greetMsg, setGreetMsg] = createSignal('')
  const [name, setName] = createSignal('')

  async function handleGreet(e: SubmitEvent) {
    e.preventDefault()
    setGreetMsg(await demoService.greet(name()))
  }

  const features = [
    ['Type-Safe Routing', 'Routes and links stay in sync across every page.'],
    ['Server Functions', 'Call server code from your UI without creating API boilerplate.'],
    ['Streaming by Default', 'Ship progressively rendered responses for faster experiences.'],
    ['Vanilla Extract Native', 'Design quickly with type-safe styling and reusable tokens.']
  ]

  return (
    <main class={`${pageWrap} ${sprinkles({ px: '4', pb: '8', pt: '14' })}`}>
      <section class={`${styles.heroSection} ${riseIn}`}>
        <div class={styles.heroGradientA} />
        <div class={styles.heroGradientB} />
        <p class={islandKicker}>TanStack Start Base Template</p>
        <h1 class={styles.heroTitle}>Start simple, ship quickly.</h1>
        <p class={styles.heroDescription}>
          This base starter intentionally keeps things light: two routes, clean structure, and the
          essentials you need to build from scratch.
        </p>
        <div class={styles.buttonGroup}>
          <Link to='/settings' class={styles.primaryButton}>
            Settings
          </Link>
          <a href='/404' class={styles.secondaryButton}>
            404 Screen
          </a>
        </div>
      </section>

      <section>
        <form onSubmit={handleGreet}>
          <input
            id='greet-input'
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder='Enter a name...'
          />
          <button type='submit'>Greet</button>
        </form>
        <p>{greetMsg()}</p>
      </section>

      <section class={styles.featuresGrid}>
        <For each={features}>
          {([title, desc], index) => (
            <article
              class={`${styles.featureItem} ${featureCard} ${riseIn}`}
              style={{ 'animation-delay': `${index() * 90 + 80}ms` }}
            >
              <h2 class={styles.featureTitle}>{title}</h2>
              <p class={styles.featureDescription}>{desc}</p>
            </article>
          )}
        </For>
      </section>
    </main>
  )
}
