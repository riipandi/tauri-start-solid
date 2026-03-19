import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { confirm } from '@tauri-apps/plugin-dialog'
import { consola } from 'consola'
import { createSignal } from 'solid-js'
import { Button } from '#/components/button'
import { SettingRow } from '#/components/setting-row'
import { Switch } from '#/components/switch'
import { Toast } from '#/components/toast'
import { uiSettings } from '#/stores/settings'
import { updateUISettings, resetSettings } from '#/stores/settings'

export const Route = createFileRoute('/(settings)/settings/general')({
  component: RouteComponent
})

function RouteComponent() {
  const ui = useStore(uiSettings)
  const [isSaving, setIsSaving] = createSignal(false)

  function showToast(type: 'success' | 'error', message: string) {
    toaster.show((props) => <Toast toast={props} type={type} title={message} />)
  }

  async function handleToggleChange() {
    setIsSaving(true)
    try {
      await updateUISettings({ enable_spell_check: !ui().enable_spell_check })
      showToast('success', 'Setting updated successfully')
    } catch (error) {
      consola.error('[Settings] Error in handleToggleChange:', error)
      showToast('error', 'Failed to update setting')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleReset() {
    const confirmation = await confirm('Are you sure you want to reset all settings to default?', {
      title: 'Confirm Reset',
      kind: 'warning'
    })

    if (!confirmation) {
      return
    }

    setIsSaving(true)
    try {
      await resetSettings()
      showToast('success', 'Settings reset to defaults')
    } catch (error) {
      consola.error('[Settings] Error in handleReset:', error)
      showToast('error', 'Failed to reset settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div class='px-5 py-4'>
      <header class='mb-6'>
        <h1 class='text-[15px] font-semibold text-foreground-neutral'>General</h1>
        <p class='text-[11px] text-foreground-neutral-faded mt-0.5'>General application preferences</p>
      </header>

      <section class='mb-6'>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>Text Editing</h2>
        <SettingRow
          label='Enable Spell Check'
          description='Check spelling as you type'
        >
          <Switch
            checked={ui().enable_spell_check}
            onChange={handleToggleChange}
            disabled={isSaving()}
          />
        </SettingRow>
      </section>

      <section>
        <h2 class='text-[13px] font-medium text-critical mb-3 pb-2 border-b border-border-neutral'>Danger Zone</h2>
        <div class='flex items-center justify-between gap-4 py-2'>
          <div class='flex-1 min-w-0'>
            <div class='text-[13px] font-medium text-foreground-neutral'>Reset All Settings</div>
            <div class='text-[11px] text-foreground-neutral-faded mt-0.5'>Restore all settings to their default values</div>
          </div>
          <Button variant='danger' onClick={handleReset} disabled={isSaving()}>
            Reset
          </Button>
        </div>
      </section>
    </div>
  )
}