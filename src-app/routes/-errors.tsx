import { Link } from '@tanstack/solid-router'

export function GlobalNotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to='/'>Go Home</Link>
    </div>
  )
}
