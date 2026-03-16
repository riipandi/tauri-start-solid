import { createFileRoute } from '@tanstack/solid-router'
import { pageWrap, islandKicker } from '#/styles/layout.css'
import { aboutSection, aboutTitle, aboutDescription } from '#/styles/screens/settings.css'
import { sprinkles } from '#/styles/sprinkles.css'

export const Route = createFileRoute('/(settings)/settings/')({
  component: About
})

function About() {
  return (
    <main class={`${pageWrap} ${sprinkles({ px: '4', py: '12' })}`}>
      <section class={aboutSection}>
        <p class={islandKicker}>About</p>
        <h1 class={aboutTitle}>A small starter with room to grow.</h1>
        <p class={aboutDescription}>
          TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. Use
          this as a clean foundation, then layer in your own routes, styling, and add-ons.
        </p>
      </section>
    </main>
  )
}
