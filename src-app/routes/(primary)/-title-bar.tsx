import { clsx } from 'clsx'
import { Show } from 'solid-js'
import { useTitleBar } from '#/hooks/use-title-bar'

export function TitleBar(props: { title?: string }) {
  const { platform, isFullscreen, isMaximized, minimize, toggleMaximize, close } = useTitleBar()
  const windowTitle = () => props.title || 'Tauri App'

  return (
    <Show when={!isFullscreen()}>
      <div
        class='flex items-center justify-between w-full relative z-50 select-none shrink-0 h-9.5 bg-background-page/80 backdrop-blur-md border-b border-border-neutral'
        data-platform={platform()}
        data-tauri-drag-region
      >
        <div class='flex items-center shrink-0' data-tauri-drag-region>
          <Show when={platform() !== 'macos'}>
            <span class='text-sm font-medium text-foreground-neutral opacity-90 whitespace-nowrap overflow-hidden text-ellipsis'>
              {windowTitle()}
            </span>
          </Show>
        </div>

        <Show when={platform() === 'macos'}>
          <div
            class='absolute left-1/2 -translate-x-1/2 pointer-events-none'
            data-tauri-drag-region
          >
            <span class='text-sm font-medium text-foreground-neutral opacity-90 whitespace-nowrap overflow-hidden text-ellipsis'>
              {windowTitle()}
            </span>
          </div>
        </Show>

        <Show when={platform() !== 'macos'}>
          <div class='flex items-center h-full pr-2 pl-2 gap-0.5'>
            <button
              type='button'
              onClick={minimize}
              class='inline-flex items-center justify-center w-11.5 h-full bg-transparent border-0 transition-colors duration-150 text-foreground-neutral hover:bg-foreground-neutral/8 active:bg-foreground-neutral/12'
              title='Minimize'
            >
              <MinimizeIcon />
            </button>
            <button
              type='button'
              onClick={toggleMaximize}
              class='inline-flex items-center justify-center w-11.5 h-full bg-transparent border-0 transition-colors duration-150 text-foreground-neutral hover:bg-foreground-neutral/8 active:bg-foreground-neutral/12'
              title={isMaximized() ? 'Restore' : 'Maximize'}
            >
              <Show when={isMaximized()} fallback={<MaximizeIcon />}>
                <RestoreIcon />
              </Show>
            </button>
            <button
              type='button'
              onClick={close}
              class={clsx(
                'inline-flex items-center justify-center w-11.5 h-full bg-transparent border-0 transition-colors duration-150 text-foreground-neutral hover:bg-foreground-neutral/8 active:bg-foreground-neutral/12',
                'hover:bg-background-critical hover:text-on-background-critical'
              )}
              data-close
              title='Close'
            >
              <CloseIcon />
            </button>
          </div>
        </Show>
      </div>
    </Show>
  )
}

function MinimizeIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <rect x='2' y='5.5' width='8' height='1' fill='currentColor' />
    </svg>
  )
}

function MaximizeIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <rect
        x='1.5'
        y='1.5'
        width='9'
        height='9'
        stroke='currentColor'
        stroke-width='1'
        fill='none'
      />
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <rect
        x='2.5'
        y='0.5'
        width='7'
        height='7'
        stroke='currentColor'
        stroke-width='1'
        fill='none'
      />
      <rect
        x='0.5'
        y='2.5'
        width='7'
        height='7'
        stroke='currentColor'
        stroke-width='1'
        fill='none'
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'>
      <path
        d='M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5'
        stroke='currentColor'
        stroke-width='1.2'
        stroke-linecap='round'
      />
    </svg>
  )
}
