import { useNavigate } from '@solidjs/router'
import { Link } from '#/components/base-ui'

export default function NotFound() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div class="relative min-h-screen bg-gray-950">
      {/* Decorative gradient */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="-inset-[10px] absolute opacity-50">
          <div class="absolute top-0 h-[40rem] w-full bg-gradient-to-b from-blue-900/30 via-transparent to-transparent" />
        </div>
      </div>

      <div class="relative flex min-h-screen flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        {/* 404 Content */}
        <div class="text-center">
          <p class="font-bold text-2xl text-blue-400">404</p>
          <h1 class="mt-4 font-bold text-3xl text-white tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p class="mt-6 text-base text-gray-300 leading-7">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-4">
            <button
              type="button"
              class="min-w-[160px] rounded-lg bg-blue-500 px-5 py-2.5 font-semibold text-black text-sm duration-200 hover:bg-blue-400 hover:shadow-blue-500/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-950"
              onClick={handleBack}
            >
              Go back
            </button>
            <Link
              href="#"
              class="min-w-[160px] rounded-lg border border-gray-800 bg-gray-900/80 px-5 py-2.5 text-center font-semibold text-gray-200 text-sm duration-200 hover:border-blue-500/30 hover:bg-gray-800 hover:text-blue-400 hover:shadow-blue-500/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-950"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* Decorative 404 background */}
        <div class="pointer-events-none absolute select-none">
          <h2 class="font-bold text-[24rem] text-blue-900/20">404</h2>
        </div>
      </div>
    </div>
  )
}
