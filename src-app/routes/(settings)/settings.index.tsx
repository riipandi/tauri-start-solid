import { createFileRoute } from '@tanstack/solid-router'
import { clsx } from 'clsx'
import { consola } from 'consola'
import { createSignal, Show, onMount, createEffect } from 'solid-js'
import { uiSettings, settingsStore } from '#/stores/settings'
import {
  updateUISettings,
  resetSettings,
  currentTheme,
  updateThemeWithSync
} from '#/stores/settings'

export const Route = createFileRoute('/(settings)/settings/')({
  component: RouteComponent
})

function RouteComponent() {
  const ui = uiSettings
  const [isSaving, setIsSaving] = createSignal(false)
  const [message, setMessage] = createSignal<{ type: 'success' | 'error'; text: string }>()

  // Debug: Log when component mounts
  onMount(() => {
    consola.log('[Settings Component] Mounted')
    consola.log('[Settings Component] Current UI from store:', ui.get())
  })

  // Debug: Log whenever ui store changes
  createEffect(() => {
    const currentUI = ui.get()
    consola.log('[Settings Component] UI store changed, new value:', currentUI)
  })

  async function handleThemeModeChange(value: 'auto' | 'dark' | 'light') {
    consola.log('[Settings] handleThemeModeChange() called with:', value)
    setIsSaving(true)
    try {
      await updateUISettings({ theme_mode: value })
      setMessage({ type: 'success', text: 'Theme mode updated successfully' })
    } catch (error) {
      consola.error('[Settings] Error in handleThemeModeChange:', error)
      setMessage({ type: 'error', text: 'Failed to update theme mode' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  async function handleThemeChange(mode: 'light' | 'dark', value: string) {
    consola.log('[Settings] handleThemeChange() called with:', { mode, value })
    setIsSaving(true)
    try {
      await updateThemeWithSync(mode, value as any)
      setMessage({
        type: 'success',
        text: `Theme updated successfully (${mode} mode: ${value})`
      })
    } catch (error) {
      consola.error('[Settings] Error in handleThemeChange:', error)
      setMessage({ type: 'error', text: 'Failed to update theme' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  async function handleToggleChange(field: 'enable_spell_check') {
    setIsSaving(true)
    try {
      await updateUISettings({ [field]: !ui.get()[field] })
      setMessage({ type: 'success', text: 'Setting updated successfully' })
    } catch (error) {
      consola.error('[Settings] Error in handleToggleChange:', error)
      setMessage({ type: 'error', text: 'Failed to update setting' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  async function handleReset() {
    if (!confirm('Are you sure you want to reset all settings to default?')) {
      consola.log('[Settings] handleReset() cancelled by user')
      return
    }

    consola.log('[Settings] handleReset() proceeding with reset')
    setIsSaving(true)
    try {
      const beforeReset = settingsStore.get()
      consola.log('[Settings] handleReset() Store state BEFORE reset:', beforeReset)

      await resetSettings()

      const afterReset = settingsStore.get()
      consola.log('[Settings] handleReset() Store state AFTER reset:', afterReset)

      setMessage({ type: 'success', text: 'Settings reset to defaults' })
    } catch (error) {
      consola.error('[Settings] Error in handleReset:', error)
      setMessage({ type: 'error', text: 'Failed to reset settings' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  return (
    <main class='max-w-2xl mx-auto my-0 w-full'>
      <div class='max-w-800 mx-auto py-8'>
        <header class='mb-12'>
          <h1 class='text-2xl font-bold mb-2'>Settings</h1>
          <p class='text-sm text-foreground-neutral-faded'>Manage your application preferences</p>
        </header>

        <Show when={message()}>
          {(msg) => (
            <div
              class={clsx(
                'py-4 px-4 rounded-lg mb-8 text-sm',
                msg().type === 'success'
                  ? 'bg-positive text-on-background-positive'
                  : 'bg-critical text-on-background-critical'
              )}
            >
              {msg().text}
            </div>
          )}
        </Show>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-foreground-neutral'>Appearance</h2>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Theme Mode
              <select
                class='w-full py-3 px-4 rounded-md border border-border-neutral bg-background-page mt-2 text-sm'
                value={ui.get().theme_mode}
                onChange={(e) => handleThemeModeChange(e.target.value as 'auto' | 'dark' | 'light')}
                disabled={isSaving()}
              >
                <option value='auto'>Auto (System)</option>
                <option value='dark'>Dark</option>
                <option value='light'>Light</option>
              </select>
            </label>
            <p class='text-xs text-foreground-neutral-faded mt-2'>
              Auto mode follows your system preference. Dark/Light forces specific mode.
            </p>
          </div>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Current Active Theme
              <input
                type='text'
                class='w-full py-3 px-4 rounded-md border border-border-neutral bg-background-page mt-2 text-sm'
                value={currentTheme.get()}
                disabled={true}
              />
            </label>
            <p class='text-xs text-foreground-neutral-faded mt-2'>
              Active theme based on your mode and system preference
            </p>
          </div>

          <div class='grid grid-cols-2 gap-4 mb-6'>
            <div>
              <label class='block mb-2 font-medium text-sm'>
                Light Theme
                <select
                  class='w-full py-3 px-4 rounded-md border border-border-neutral bg-background-page mt-2 text-sm'
                  value={ui.get().theme_light}
                  onChange={(e) => handleThemeChange('light', e.target.value)}
                  disabled={isSaving()}
                >
                  <option value='default-light'>Default Light</option>
                  <option value='modern-light'>Modern Light</option>
                </select>
              </label>
              <p class='text-xs text-foreground-neutral-faded mt-2'>Theme for light mode</p>
            </div>

            <div>
              <label class='block mb-2 font-medium text-sm'>
                Dark Theme
                <select
                  class='w-full py-3 px-4 rounded-md border border-border-neutral bg-background-page mt-2 text-sm'
                  value={ui.get().theme_dark}
                  onChange={(e) => handleThemeChange('dark', e.target.value)}
                  disabled={isSaving()}
                >
                  <option value='default-dark'>Default Dark</option>
                  <option value='modern-dark'>Modern Dark</option>
                </select>
              </label>
              <p class='text-xs text-foreground-neutral-faded mt-2'>Theme for dark mode</p>
            </div>
          </div>

          <div class='bg-background-primary-faded border border-border-primary-faded rounded-lg p-4 mb-6'>
            <p class='text-sm text-foreground-primary'>
              <strong>💡 Tip:</strong> Light and dark themes are automatically paired. When you
              select a theme, its counterpart is automatically applied to the other mode.
            </p>
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-foreground-neutral'>Text Editing</h2>

          <div class='mb-6'>
            <label class='flex items-center gap-3 text-sm'>
              <input
                type='checkbox'
                checked={ui.get().enable_spell_check}
                onChange={() => handleToggleChange('enable_spell_check')}
                disabled={isSaving()}
              />
              <span>Enable Spell Check</span>
            </label>
            <p class='text-xs text-foreground-neutral-faded mt-2'>Check spelling as you type</p>
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-foreground-neutral'>Danger Zone</h2>

          <button
            type='button'
            class='py-3 px-6 bg-critical text-on-background-critical border-0 rounded-md text-sm font-medium hover:bg-critical-faded disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleReset}
            disabled={isSaving()}
          >
            Reset All Settings
          </button>
        </section>

        <Show when={isSaving()}>
          <div class='fixed bottom-8 right-8 py-4 px-8 bg-foreground-neutral text-on-background-neutral rounded-md text-sm shadow-raised'>
            Saving changes...
          </div>
        </Show>
      </div>
    </main>
  )
}
