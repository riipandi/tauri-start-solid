import { useStore } from '@nanostores/solid'
import { uiStore } from '#/context/stores/ui.store'
import SettingsLayout from '#/layouts/settings-layout'

export default function Component() {
  const _uiState = useStore(uiStore)

  return (
    <SettingsLayout>
      <div class="flex min-h-full w-full flex-col items-center justify-center rounded-bl-[10px]">
        <h1>Settings</h1>
      </div>
    </SettingsLayout>
  )
}
