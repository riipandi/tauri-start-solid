import { RouterProvider, createRouter } from '@tanstack/solid-router'
import { render } from 'solid-js/web'
import { routeTree } from './routes.gen'
import './styles/globals.css'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
})

// Create root element and ensure exists.
const rootElement = document.getElementById('app')
if (!rootElement) {
  throw new Error("Root element not found. Check if it's in your index.html")
}

const MainApp = () => {
  const hasTauriEnv = '__TAURI__' in window
  return import.meta.env.DEV && !hasTauriEnv ? (
    <div class='flex size-full min-h-screen items-center justify-center bg-background p-4 bg-background-page'>
      <p class='font-medium text-foreground tracking-wide text-foreground-neutral'>
        This application will not work in browser.
      </p>
    </div>
  ) : (
    <RouterProvider router={router} />
  )
}

// Set `withGlobalTauri` to `true` in `tauri.conf.json`.
// If the frontend running in browser, throw an error because
// this application will not work in Browser.
render(() => <MainApp />, rootElement)

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}
