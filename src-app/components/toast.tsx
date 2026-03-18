import * as BaseToast from '@kobalte/core/toast'
import { clsx } from 'clsx'
import { Show } from 'solid-js'

export function ToastProvider() {
  return (
    <BaseToast.Region>
      <BaseToast.List class='fixed bottom-8 right-8 z-50 flex flex-col gap-3 w-95 max-w-[100vw] list-none p-0 m-0 outline-none' />
    </BaseToast.Region>
  )
}

export function Toast(props: {
  toast: { toastId: number }
  type: 'success' | 'error'
  title: string
}) {
  return (
    <BaseToast.Root
      toastId={props.toast.toastId}
      class={clsx(
        'relative flex items-start gap-3 py-3 px-4 rounded-lg shadow-raised',
        'transition-all duration-300 ease-out',
        'data-[swipe=move]:translate-x-(--kb-toast-scroll-progress) data-[swipe=move]:transition-none',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform',
        'data-[swipe=end]:animate-swipe-out',
        'data-opened:animate-in data-closed:animate-out data-[swipe=end]:animate-out',
        'data-closed:fade-out-80 data-closed:slide-out-to-right-full data-ended:hidden',
        props.type === 'success'
          ? 'bg-positive text-on-background-positive'
          : 'bg-critical text-on-background-critical'
      )}
    >
      <div class='shrink-0 pt-0.5'>
        <Show when={props.type === 'success'}>
          <svg
            class='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M5 13l4 4L19 7'
            />
          </svg>
        </Show>

        <Show when={props.type !== 'success'}>
          <svg
            class='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </Show>
      </div>

      <div class='flex-1'>
        <BaseToast.Title class='text-sm font-semibold mb-0.5'>
          {props.type === 'success' ? 'Success' : 'Error'}
        </BaseToast.Title>
        <BaseToast.Description class='text-sm opacity-90'>{props.title}</BaseToast.Description>
      </div>

      <BaseToast.CloseButton
        class={clsx(
          'shrink-0 p-1 rounded-sm transition-opacity',
          'hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-current',
          'opacity-70 hover:opacity-100'
        )}
      >
        <svg
          class='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </BaseToast.CloseButton>

      <BaseToast.ProgressTrack class='absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg'>
        <BaseToast.ProgressFill
          class={clsx(
            'h-full transition-all duration-300 ease-linear',
            props.type === 'success'
              ? 'bg-on-background-positive/30'
              : 'bg-on-background-critical/30'
          )}
        />
      </BaseToast.ProgressTrack>
    </BaseToast.Root>
  )
}
