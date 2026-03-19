import { createFileRoute, Outlet, Link } from '@tanstack/solid-router'
import { TitleBar } from '#/components/title-bar'

export const Route = createFileRoute('/(settings)')({
  component: RouteComponent
})

const navItems = [
  { path: '/settings/general', label: 'General' },
  { path: '/settings/appearance', label: 'Appearance' },
  { path: '/settings/about', label: 'About' }
]

function RouteComponent() {
  return (
    <div class='flex flex-col h-screen'>
      <TitleBar title='Settings' />
      <div class='flex flex-1 overflow-hidden'>
        <nav class='w-40 shrink-0 border-r border-border-neutral bg-background-page/50 overflow-y-auto'>
          <div class='py-3 px-2'>
            <ul class='space-y-0.5'>
              {navItems.map((item) => (
                <li>
                  <Link
                    to={item.path}
                    class='block py-1.5 px-2.5 rounded-md text-[13px] transition-colors text-foreground-neutral-faded hover:bg-background-neutral-faded hover:text-foreground-neutral'
                    activeProps={{
                      class: 'bg-background-primary/10 text-foreground-primary font-medium'
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <main class='flex-1 overflow-y-auto overflow-x-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}