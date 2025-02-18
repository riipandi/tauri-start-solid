import { getCurrentWindow } from '@tauri-apps/api/window'
import { platform } from '@tauri-apps/plugin-os'
import * as Lucide from 'lucide-solid'
import { ComponentProps, Show } from 'solid-js'
import { clx } from '#/libs/utils'

interface TitlebarProps extends ComponentProps<'div'> {}

const Titlebar = (props: TitlebarProps) => {
  const appPlatform = platform()
  const appWindow = getCurrentWindow()
  const isMaximized = appWindow.isMaximized()
  const isMacOS = appPlatform === 'macos'

  return (
    <div
      data-tauri-drag-region
      class={clx(
        'relative flex h-7 w-full items-center justify-between',
        'border-border/40 border-b bg-transparent backdrop-blur-sm',
        !isMaximized ? 'rounded-t-[10px]' : 'rounded-none',
        isMacOS ? 'pl-14' : 'p-0',
        props.class
      )}
    >
      <div
        data-tauri-drag-region
        class={clx(
          !isMacOS ? 'mr-2 rounded-tl-[10px]' : 'rounded-tr-[10px]',
          'flex size-full items-center gap-2'
        )}
      >
        {/* App title or logo */}
      </div>

      <Show when={!isMacOS}>
        <div class="flex size-full max-w-max items-center justify-end gap-0">
          <button
            type="button"
            id="minimize-button"
            class="inline-flex h-full w-9 items-center justify-center text-muted-foreground hover:bg-gray-200 hover:text-primary dark:hover:bg-gray-600"
            onClick={() => appWindow.minimize()}
          >
            <Lucide.Minus class="size-4" strokeWidth={2.2} />
          </button>
          <button
            type="button"
            id="maximize-button"
            onClick={() => appWindow.toggleMaximize()}
            class="inline-flex h-full w-9 items-center justify-center text-muted-foreground hover:bg-gray-200 hover:text-primary dark:hover:bg-gray-600"
          >
            <Lucide.Square class="size-3" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            id="close-button"
            onClick={() => appWindow.close()}
            class="grup inline-flex h-full w-9 items-center justify-center rounded-tr-[10px] text-muted-foreground hover:bg-red-500 hover:text-white"
          >
            <Lucide.X class="size-4" strokeWidth={2} />
          </button>
        </div>
      </Show>
    </div>
  )
}

export default Titlebar
