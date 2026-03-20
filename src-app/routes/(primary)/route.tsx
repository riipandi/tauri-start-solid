import { createFileRoute, Outlet } from '@tanstack/solid-router'
import { getName } from '@tauri-apps/api/app'
import { createSignal, onMount } from 'solid-js'
import { TitleBar } from './-title-bar'

export const Route = createFileRoute('/(primary)')({
  component: RouteComponent
})

function RouteComponent() {
  const [appName, setAppName] = createSignal<string>('')

  onMount(async () => {
    setAppName(await getName())
  })

  return (
    <div class='flex flex-col h-screen'>
      <TitleBar title={appName()} />
      <div class='flex-1 overflow-y-auto overflow-x-hidden'>
        <Outlet />
      </div>
    </div>
  )
}
