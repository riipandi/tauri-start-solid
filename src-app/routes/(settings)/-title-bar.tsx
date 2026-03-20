import { clsx } from 'clsx'
import { Show } from 'solid-js'
import { useAppInfo } from '#/hooks/use-app-info'

export function SettingsTitleBar() {
  const appInfo = useAppInfo()

  return (
    <div
      class='flex items-center justify-between w-full relative z-50 select-none shrink-0 h-9 bg-transparent'
      data-platform={appInfo.osPlatform()}
      data-tauri-drag-region
    >
      <div class='w-48 h-full border-r border-border-neutral' data-tauri-drag-region></div>
      <Show when={appInfo.osPlatform() !== 'macos'}>
        <button
          type='button'
          onClick={close}
          class={clsx(
            'inline-flex items-center justify-center w-11.5 h-full bg-transparent border-0 transition-colors duration-150 text-foreground-neutral hover:bg-foreground-neutral/8 active:bg-foreground-neutral/12',
            'hover:bg-background-critical hover:text-on-background-critical'
          )}
          title='Close'
        >
          <CloseIcon />
        </button>
      </Show>
    </div>
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
