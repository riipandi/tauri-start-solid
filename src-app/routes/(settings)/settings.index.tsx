import { createFileRoute } from '@tanstack/solid-router'
import { clsx } from 'clsx'
import { consola } from 'consola'
import { createSignal, Show, onMount, createEffect } from 'solid-js'
import { uiSettings, settingsStore } from '#/stores/settings'
import { updateUISettings, resetSettings, currentTheme } from '#/stores/settings'

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
          <p class='text-sm text-slate-600'>Manage your application preferences</p>
        </header>

        <Show when={message()}>
          {(msg) => (
            <div
              class={clsx(
                'py-4 px-4 rounded-lg mb-8 text-sm',
                msg().type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              )}
            >
              {msg().text}
            </div>
          )}
        </Show>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-slate-800'>Appearance</h2>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Theme Mode
              <select
                class='w-full py-3 px-4 rounded-md border border-slate-600 bg-white mt-2 text-sm'
                value={ui.get().theme_mode}
                onChange={(e) => handleThemeModeChange(e.target.value as 'auto' | 'dark' | 'light')}
                disabled={isSaving()}
              >
                <option value='auto'>Auto</option>
                <option value='dark'>Dark</option>
                <option value='light'>Light</option>
              </select>
            </label>
            <p class='text-xs text-slate-600 mt-2'>Choose between auto, dark, or light theme</p>
          </div>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Current Theme
              <input
                type='text'
                class='w-full py-3 px-4 rounded-md border border-slate-600 bg-white mt-2 text-sm'
                value={currentTheme.get()}
                disabled={true}
              />
            </label>
            <p class='text-xs text-slate-600 mt-2'>
              Active theme based on theme mode (Auto: {ui.get().theme_dark}, Dark:{' '}
              {ui.get().theme_dark}, Light: {ui.get().theme_light})
            </p>
          </div>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Light Mode Theme
              <input
                type='text'
                class='w-full py-3 px-4 rounded-md border border-slate-600 bg-white mt-2 text-sm'
                value={ui.get().theme_light}
                onChange={(e) => updateUISettings({ theme_light: e.target.value })}
                disabled={isSaving()}
              />
            </label>
            <p class='text-xs text-slate-600 mt-2'>Theme to use when theme mode is set to light</p>
          </div>

          <div class='mb-6'>
            <label class='block mb-2 font-medium text-sm'>
              Dark Mode Theme
              <input
                type='text'
                class='w-full py-3 px-4 rounded-md border border-slate-600 bg-white mt-2 text-sm'
                value={ui.get().theme_dark}
                onChange={(e) => updateUISettings({ theme_dark: e.target.value })}
                disabled={isSaving()}
              />
            </label>
            <p class='text-xs text-slate-600 mt-2'>Theme to use when theme mode is set to dark</p>
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-slate-800'>Text Editing</h2>

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
            <p class='text-xs text-slate-600 mt-2'>Check spelling as you type</p>
          </div>
        </section>

        <section class='mb-12'>
          <h2 class='text-xl font-bold mb-6 text-slate-800'>Danger Zone</h2>

          <button
            type='button'
            class='py-3 px-6 bg-red-500 text-white border-0 rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleReset}
            disabled={isSaving()}
          >
            Reset All Settings
          </button>
        </section>

        <Show when={isSaving()}>
          <div class='fixed bottom-8 right-8 py-4 px-8 bg-slate-800 text-white rounded-md text-sm shadow-[0_4px_6px_rgba(0,0,0,0.1)]'>
            Saving changes...
          </div>
        </Show>
      </div>
    </main>
  )
}
