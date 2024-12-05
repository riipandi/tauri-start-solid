/* @refresh reload */
import { render } from 'solid-js/web'
import './assets/styles/globals.css'
import AppRoutes from './routes'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  )
}

// Set `withGlobalTauri` to `true` in `tauri.conf.json`.
// If the frontend running in browser, throw an error because
// this application will not work in Browser.
const MainApp = () => {
  return !('__TAURI__' in window) ? (
    <div class="flex size-full min-h-screen items-center justify-center p-4 dark:bg-black">
      <p class="font-medium tracking-wide dark:text-white">
        This application will not work in Browser.
      </p>
    </div>
  ) : (
    <AppRoutes />
  )
}

render(() => <MainApp />, rootElement)
