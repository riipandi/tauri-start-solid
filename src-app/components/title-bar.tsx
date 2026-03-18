import { clsx } from 'clsx'
import { Show } from 'solid-js'
import { useTitleBar } from '#/hooks/use-title-bar'
import * as styles from '#/styles/components/title-bar.css'

interface TitleBarProps {
  appTitle?: string
}

export function TitleBar(props: TitleBarProps) {
  const { platform, isFullscreen, isMaximized, minimize, toggleMaximize, close } = useTitleBar()
  const appTitle = () => props.appTitle || 'Tauri App'

  return (
    <Show when={!isFullscreen()}>
      <div class={clsx(styles.titleBar)} data-platform={platform()} data-tauri-drag-region>
        <div class={styles.leftSection} data-tauri-drag-region>
          <Show when={platform() !== 'macos'}>
            <span class={styles.appTitle}>{appTitle()}</span>
          </Show>
        </div>

        <Show when={platform() === 'macos'}>
          <div class={styles.centerSection} data-tauri-drag-region>
            <span class={styles.appTitle}>{appTitle()}</span>
          </div>
        </Show>

        <Show when={platform() !== 'macos'}>
          <div class={styles.controls}>
            <button type='button' onClick={minimize} class={styles.controlButton} title='Minimize'>
              <MinimizeIcon />
            </button>
            <button
              type='button'
              onClick={toggleMaximize}
              class={styles.controlButton}
              title={isMaximized() ? 'Restore' : 'Maximize'}
            >
              <Show when={isMaximized()} fallback={<MaximizeIcon />}>
                <RestoreIcon />
              </Show>
            </button>
            <button
              type='button'
              onClick={close}
              class={styles.controlButton}
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
