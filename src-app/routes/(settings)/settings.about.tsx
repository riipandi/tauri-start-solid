import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { confirm } from '@tauri-apps/plugin-dialog'
import { consola } from 'consola'
import { createSignal, Show } from 'solid-js'
import { Button } from '#/components/button'
import { Toast } from '#/components/toast'
import { useAppInfo } from '#/hooks/use-app-info'
import { licenseKey } from '#/stores/settings.store'
import { updateLicenseKey } from '#/stores/settings.store'
import { SettingRow } from './-setting-row'

export const Route = createFileRoute('/(settings)/settings/about')({
  component: RouteComponent
})

function RouteComponent() {
  const appInfo = useAppInfo()
  const license = useStore(licenseKey)
  const [isSaving, setIsSaving] = createSignal(false)
  const [licenseKeyInput, setLicenseKeyInput] = createSignal('')

  function showToast(type: 'success' | 'error', message: string) {
    toaster.show((props) => <Toast toast={props} type={type} title={message} />)
  }

  async function handleLicenseKeySave() {
    const value = licenseKeyInput().trim()

    if (!value) {
      showToast('error', 'License key cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      await updateLicenseKey(value)
      showToast('success', 'License key saved successfully')
      setLicenseKeyInput('')
    } catch (error) {
      consola.error('[Settings] Error saving license key:', error)
      showToast('error', 'Failed to save license key')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleLicenseKeyClear() {
    const confirmation = await confirm('Are you sure you want to clear the license key?', {
      title: 'Confirm Clear',
      kind: 'warning'
    })

    if (!confirmation) {
      return
    }

    setIsSaving(true)
    try {
      await updateLicenseKey('')
      showToast('success', 'License key cleared')
      setLicenseKeyInput('')
    } catch (error) {
      consola.error('[Settings] Error clearing license key:', error)
      showToast('error', 'Failed to clear license key')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div class='px-5 pb-4 pt-0'>
      <header class='mb-6'>
        <h1 class='text-[15px] font-semibold text-foreground-neutral'>About</h1>
        <p class='text-[11px] text-foreground-neutral-faded mt-0.5'>
          Application information and license
        </p>
      </header>

      <section class='mb-6'>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Application Information
        </h2>

        <SettingRow label='Name'>
          <span class='text-[13px] text-foreground-neutral'>{appInfo.appName()}</span>
        </SettingRow>

        <SettingRow label='Version'>
          <span class='text-[13px] text-foreground-neutral'>{appInfo.appVersion()}</span>
        </SettingRow>

        <SettingRow label='Tauri Version'>
          <span class='text-[13px] text-foreground-neutral'>{appInfo.tauriVersion()}</span>
        </SettingRow>
      </section>

      <section>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          License
        </h2>

        <Show when={!license()}>
          <div class='flex items-center gap-4 py-2'>
            <div class='flex-1 min-w-0'>
              <div class='text-[13px] font-medium text-foreground-neutral'>License Key</div>
              <div class='text-[11px] text-foreground-neutral-faded mt-0.5'>
                Your license key is encrypted and stored securely on this device
              </div>
            </div>
            <div class='shrink-0 flex items-center gap-2'>
              <input
                type='text'
                class='w-48 py-1.5 px-2.5 rounded-md border border-border-neutral bg-background-page text-[13px] text-foreground-neutral placeholder:text-foreground-neutral-faded/50 focus:outline-none focus:ring-2 focus:ring-border-primary focus:ring-offset-1 focus:ring-offset-background-page disabled:opacity-50 disabled:cursor-not-allowed'
                placeholder='Enter license key...'
                value={licenseKeyInput()}
                onInput={(e) => setLicenseKeyInput(e.currentTarget.value)}
                disabled={isSaving()}
              />
              <Button
                onClick={handleLicenseKeySave}
                disabled={isSaving() || !licenseKeyInput().trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </Show>

        <Show when={license()}>
          <SettingRow label='License Status' description='License key is configured'>
            <div class='flex items-center gap-2'>
              <div class='w-2 h-2 rounded-full bg-background-positive' />
              <Button variant='secondary' onClick={handleLicenseKeyClear} disabled={isSaving()}>
                Clear
              </Button>
            </div>
          </SettingRow>
        </Show>
      </section>
    </div>
  )
}
