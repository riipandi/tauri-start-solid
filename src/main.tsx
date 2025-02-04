import './styles/global.css'
import './styles/colors.css'
import './styles/scrollbar.css'

/* @refresh reload */
import { render } from 'solid-js/web'
import AppRoutes from './routes'

// This is the entry point of the application.
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
    <div class="flex size-full min-h-screen items-center justify-center bg-background p-4">
      <p class="font-medium text-foreground tracking-wide">
        This application will not work in Browser.
      </p>
    </div>
  ) : (
    <AppRoutes />
  )
}

render(() => <MainApp />, rootElement)
