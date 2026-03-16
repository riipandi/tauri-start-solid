import { Link } from '@tanstack/solid-router'
import { clsx } from 'clsx'
import { riseIn } from '#/styles/layout.css'
import * as styles from '#/styles/screens/error.css'

export function GlobalNotFound() {
  return (
    <main class={styles.errorContainer}>
      <div class={clsx(styles.errorCard, riseIn)}>
        <h1 class={styles.errorCode}>404</h1>
        <h2 class={styles.errorTitle}>Page not found</h2>
        <p class={styles.errorDescription}>
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <Link to='/' class={styles.homeButton}>
          Go Home
        </Link>
      </div>
    </main>
  )
}
