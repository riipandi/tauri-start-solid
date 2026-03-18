import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { confirm } from '@tauri-apps/plugin-dialog'
import { consola } from 'consola'
import { createSignal, Show } from 'solid-js'
import { Select, type SelectOption } from '#/components/select'
import { Switch } from '#/components/switch'
import { Toast } from '#/components/toast'
import { uiSettings, currentTheme, licenseKey } from '#/stores/settings'
import { updateLicenseKey, updateUISettings, resetSettings, updateTheme } from '#/stores/settings'

export const Route = createFileRoute('/(settings)/settings/')({
  component: RouteComponent
})

function RouteComponent() {
  const ui = useStore(uiSettings)
  const theme = useStore(currentTheme)
  const license = useStore(licenseKey)
  const [isSaving, setIsSaving] = createSignal(false)
  const [licenseKeyInput, setLicenseKeyInput] = createSignal('')

  function showToast(type: 'success' | 'error', message: string) {
    toaster.show((props) => <Toast toast={props} type={type} title={message} />)
  }

  async function handleThemeModeChange(option: SelectOption | null) {
    if (!option) return
    const value = option.value as 'auto' | 'dark' | 'light'
    setIsSaving(true)
    try {
      await updateUISettings({ theme_mode: value })
      showToast('success', 'Theme mode updated successfully')
    } catch (error) {
      consola.error('[Settings] Error in handleThemeModeChange:', error)
      showToast('error', 'Failed to update theme mode')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleThemeChange(mode: 'light' | 'dark', option: SelectOption | null) {
    if (!option) return
    const value = option.value
    setIsSaving(true)
    try {
      await updateTheme(mode, value as any)
      showToast('success', `Theme updated successfully (${mode} mode: ${value})`)
    } catch (error) {
      consola.error('[Settings] Error in handleThemeChange:', error)
      showToast('error', 'Failed to update theme')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleToggleChange(field: 'enable_spell_check') {
    setIsSaving(true)
    try {
      await updateUISettings({ [field]: !ui()[field] })
      showToast('success', 'Setting updated successfully')
    } catch (error) {
      consola.error('[Settings] Error in handleToggleChange:', error)
      showToast('error', 'Failed to update setting')
    } finally {
      setIsSaving(false)
    }
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
    <main class='max-w-xl mx-auto my-0 w-full'>
      <div class='mx-auto py-8 px-4'>
        <header class='mb-12'>
          <h1 class='text-2xl font-bold mb-2 text-foreground-neutral'>Settings</h1>
          <p class='text-sm text-foreground-neutral-faded'>Manage your application preferences</p>
        </header>

        <section class='mb-12'>
          <h2 class='text-lg font-semibold mb-6 text-foreground-neutral'>Appearance</h2>

          <div class='space-y-6'>
            <Select
              name='theme_mode'
              label='Theme Mode'
              description='Auto mode follows your system preference. Dark/Light forces specific mode.'
              value={ui().theme_mode}
              onChange={handleThemeModeChange}
              disabled={isSaving()}
              options={[
                { value: 'auto', label: 'Auto (System)' },
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' }
              ]}
            />

            <div>
              <label class='block mb-2 font-medium text-sm text-foreground-neutral'>
                Current Active Theme
              </label>
              <input
                type='text'
                class='w-full py-2.5 px-3 rounded-md border border-border-neutral bg-background-neutral/50 text-sm text-foreground-neutral-faded cursor-not-allowed'
                value={theme()}
                disabled={true}
              />
              <p class='text-xs text-foreground-neutral-faded mt-2'>
                Active theme based on your mode and system preference
              </p>
            </div>

            <Select
              name='theme_light'
              label='Light Theme'
              description='Theme used when in light mode or when system is in light mode (auto)'
              value={ui().theme_light}
              onChange={(option) => handleThemeChange('light', option)}
              disabled={isSaving()}
              options={[
                { value: 'default-light', label: 'Default Light' },
                { value: 'modern-light', label: 'Modern Light' }
              ]}
            />

            <Select
              name='theme_dark'
              label='Dark Theme'
              description='Theme used when in dark mode or when system is in dark mode (auto)'
              value={ui().theme_dark}
              onChange={(option) => handleThemeChange('dark', option)}
              disabled={isSaving()}
              options={[
                { value: 'default-dark', label: 'Default Dark' },
                { value: 'modern-dark', label: 'Modern Dark' }
              ]}
            />
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-lg font-semibold mb-6 text-foreground-neutral'>Text Editing</h2>

          <div class='space-y-6'>
            <Switch
              name='enable_spell_check'
              label='Enable Spell Check'
              description='Check spelling as you type'
              checked={ui().enable_spell_check}
              onChange={() => handleToggleChange('enable_spell_check')}
              disabled={isSaving()}
            />
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-lg font-semibold mb-6 text-foreground-neutral'>License</h2>

          <div class='space-y-4'>
            <Show when={!license()}>
              <div>
                <label
                  for='license-key-input'
                  class='block mb-2 font-medium text-sm text-foreground-neutral'
                >
                  License Key
                </label>
                <input
                  id='license-key-input'
                  type='text'
                  class='w-full py-2.5 px-3 rounded-md border border-border-neutral bg-background-neutral text-sm text-foreground-neutral placeholder:text-foreground-neutral-faded/50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  placeholder='Enter your license key...'
                  value={licenseKeyInput()}
                  onInput={(e) => setLicenseKeyInput(e.currentTarget.value)}
                  disabled={isSaving()}
                />
                <p class='text-xs text-foreground-neutral-faded mt-2'>
                  Your license key is encrypted and stored securely on this device.
                </p>

                <div class='flex gap-3 mt-4'>
                  <button
                    type='button'
                    class='px-6 py-2.5 rounded-lg bg-primary text-on-background-primary border-0 text-sm font-medium hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    onClick={handleLicenseKeySave}
                    disabled={isSaving() || !licenseKeyInput().trim()}
                  >
                    Save License Key
                  </button>
                </div>
              </div>
            </Show>

            <Show when={license()}>
              <div class='p-3 rounded-md bg-background-neutral/50 border border-border-neutral'>
                <div class='flex items-center justify-between'>
                  <div class='flex items-center gap-2'>
                    <div class='w-2 h-2 rounded-full bg-success' />
                    <span class='text-sm text-foreground-neutral'>License key is configured</span>
                  </div>
                  <button
                    type='button'
                    class='px-3 py-1.5 rounded-md text-xs font-medium text-critical hover:bg-critical/10 active:bg-critical/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    onClick={handleLicenseKeyClear}
                    disabled={isSaving()}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-lg font-semibold mb-6 text-foreground-neutral'>Danger Zone</h2>

          <button
            type='button'
            class='px-6 py-2.5 rounded-lg bg-critical text-on-background-critical border-0 text-sm font-medium hover:bg-critical/90 active:bg-critical/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            onClick={handleReset}
            disabled={isSaving()}
          >
            Reset All Settings
          </button>
        </section>
      </div>
    </main>
  )
}
