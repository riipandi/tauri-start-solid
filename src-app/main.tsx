import './styles/global.css'
import './styles/colors.css'
import './styles/scrollbar.css'

import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
/* @refresh reload */
import { render } from 'solid-js/web'
import RootLayout from '#/layouts/root-layout'

// Lazy loading views
const Home = lazy(() => import('#/views/home'))
const Settings = lazy(() => import('#/views/settings'))
const NotFound = lazy(() => import('#/views/404'))

// This is the entry point of the application.
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Check if the id is correct.')
}

const MainApp = () => {
  return !('__TAURI__' in window) ? (
    <div class="flex size-full min-h-screen items-center justify-center bg-background p-4">
      <p class="font-medium text-foreground tracking-wide">
        This application will not work in Browser.
      </p>
    </div>
  ) : (
    <Router root={RootLayout}>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
      <Route path="*404" component={NotFound} />
    </Router>
  )
}

// Set `withGlobalTauri` to `true` in `tauri.conf.json`.
// If the frontend running in browser, throw an error because
// this application will not work in Browser.
render(() => <MainApp />, rootElement)
