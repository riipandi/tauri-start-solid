import { Link } from '@tanstack/solid-router'

export function GlobalNotFound() {
  return (
    <main class='flex items-center justify-center min-h-screen w-full'>
      <div class='px-8 py-10 text-center rounded-xl max-w-xl'>
        <h1 class='text-6xl font-bold leading-none mb-4 bg-linear-to-br from-teal-600 to-green-700 bg-clip-text text-transparent'>
          404
        </h1>
        <h2 class='text-2xl font-bold mb-3 text-slate-800'>Page not found</h2>
        <p class='text-base leading-relaxed text-slate-600 mb-8'>
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <Link
          to='/'
          class='inline-block rounded-full border border-slate-800/20 bg-white/50 py-2.5 px-5 text-sm font-semibold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-slate-800/35 active:translate-y-0 text-decoration-none'
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
