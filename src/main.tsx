import { attachConsole } from '@tauri-apps/plugin-log'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

import './assets/styles/main.css'

const root = document.getElementById('root') as HTMLElement

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found. Did you forget to add it to your index.html?')
}

// Set `withGlobalTauri` to `true` in `tauri.conf.json`.
// If the frontend running in browser, throw an error because
// this application will not work in Browser.
if (!('__TAURI__' in window)) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <div className="size-full p-4 min-h-screen items-center justify-center flex dark:bg-black">
        <p className="font-medium tracking-wide dark:text-white">
          This application will not work in Browser.
        </p>
      </div>
    </React.StrictMode>
  )
}

// Print logs to the browser console (TargetKind::Webview)
const detach = await attachConsole()

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

detach() // detach the browser console from the log stream
