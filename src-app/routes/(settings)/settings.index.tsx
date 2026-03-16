import { createFileRoute } from '@tanstack/solid-router'
import { pageWrap } from '#/styles/layout.css'
import * as styles from '#/styles/screens/settings.css'

export const Route = createFileRoute('/(settings)/settings/')({
  component: Settings
})

function Settings() {
  return (
    <main class={pageWrap}>
      <div class={styles.placeholder}>
        <p>Settings</p>
      </div>
    </main>
  )
}
