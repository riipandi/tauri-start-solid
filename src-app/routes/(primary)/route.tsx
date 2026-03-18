import { createFileRoute, Outlet } from '@tanstack/solid-router'
import { TitleBar } from '#/components/title-bar'

export const Route = createFileRoute('/(primary)')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div class='flex flex-col h-screen'>
      <TitleBar title='Tauri App' />
      <div class='flex-1 overflow-y-auto overflow-x-hidden'>
        <Outlet />
      </div>
    </div>
  )
}
