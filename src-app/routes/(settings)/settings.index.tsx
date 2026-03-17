import { createFileRoute } from '@tanstack/solid-router'
import { createSignal, Show, onMount, createEffect } from 'solid-js'
import {
  uiSettings,
  updateUISettings,
  resetSettings,
  currentTheme,
  settingsStore
} from '#/stores/settings'
import { pageWrap } from '#/styles/layout.css'
import * as styles from '#/styles/screens/settings.css'

export const Route = createFileRoute('/(settings)/settings/')({
  component: Settings
})

function Settings() {
  const ui = uiSettings
  const [isSaving, setIsSaving] = createSignal(false)
  const [message, setMessage] = createSignal<{ type: 'success' | 'error'; text: string }>()

  // Debug: Log when component mounts
  onMount(() => {
    console.log('[Settings Component] Mounted')
    console.log('[Settings Component] Current UI from store:', ui.get())
  })

  // Debug: Log whenever ui store changes
  createEffect(() => {
    const currentUI = ui.get()
    console.log('[Settings Component] UI store changed, new value:', currentUI)
  })

  async function handleThemeModeChange(value: 'auto' | 'dark' | 'light') {
    console.log('[Settings] handleThemeModeChange() called with:', value)
    setIsSaving(true)
    try {
      await updateUISettings({ theme_mode: value })
      setMessage({ type: 'success', text: 'Theme mode updated successfully' })
    } catch (error) {
      console.error('[Settings] Error in handleThemeModeChange:', error)
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
      console.error('[Settings] Error in handleToggleChange:', error)
      setMessage({ type: 'error', text: 'Failed to update setting' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  async function handleReset() {
    if (!confirm('Are you sure you want to reset all settings to default?')) {
      console.log('[Settings] handleReset() cancelled by user')
      return
    }

    console.log('[Settings] handleReset() proceeding with reset')
    setIsSaving(true)
    try {
      const beforeReset = settingsStore.get()
      console.log('[Settings] handleReset() Store state BEFORE reset:', beforeReset)

      await resetSettings()

      const afterReset = settingsStore.get()
      console.log('[Settings] handleReset() Store state AFTER reset:', afterReset)

      setMessage({ type: 'success', text: 'Settings reset to defaults' })
    } catch (error) {
      console.error('[Settings] Error in handleReset:', error)
      setMessage({ type: 'error', text: 'Failed to reset settings' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setMessage(undefined), 3000)
    }
  }

  return (
    <main class={pageWrap}>
      <div class={styles.container}>
        <header class={styles.header}>
          <h1>Settings</h1>
          <p class={styles.subtitle}>Manage your application preferences</p>
        </header>

        <Show when={message()}>
          {(msg) => (
            <div class={msg().type === 'success' ? styles.success : styles.error}>{msg().text}</div>
          )}
        </Show>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>Appearance</h2>

          <div class={styles.field}>
            <label class={styles.label}>
              Theme Mode
              <select
                class={styles.select}
                value={ui.get().theme_mode}
                onChange={(e) => handleThemeModeChange(e.target.value as 'auto' | 'dark' | 'light')}
                disabled={isSaving()}
              >
                <option value='auto'>Auto</option>
                <option value='dark'>Dark</option>
                <option value='light'>Light</option>
              </select>
            </label>
            <p class={styles.help}>Choose between auto, dark, or light theme</p>
          </div>

          <div class={styles.field}>
            <label class={styles.label}>
              Current Theme
              <input type='text' class={styles.input} value={currentTheme.get()} disabled={true} />
            </label>
            <p class={styles.help}>
              Active theme based on theme mode (Auto: {ui.get().theme_dark}, Dark:{' '}
              {ui.get().theme_dark}, Light: {ui.get().theme_light})
            </p>
          </div>

          <div class={styles.field}>
            <label class={styles.label}>
              Light Mode Theme
              <input
                type='text'
                class={styles.input}
                value={ui.get().theme_light}
                onChange={(e) => updateUISettings({ theme_light: e.target.value })}
                disabled={isSaving()}
              />
            </label>
            <p class={styles.help}>Theme to use when theme mode is set to light</p>
          </div>

          <div class={styles.field}>
            <label class={styles.label}>
              Dark Mode Theme
              <input
                type='text'
                class={styles.input}
                value={ui.get().theme_dark}
                onChange={(e) => updateUISettings({ theme_dark: e.target.value })}
                disabled={isSaving()}
              />
            </label>
            <p class={styles.help}>Theme to use when theme mode is set to dark</p>
          </div>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>Text Editing</h2>

          <div class={styles.field}>
            <label class={styles.checkboxLabel}>
              <input
                type='checkbox'
                checked={ui.get().enable_spell_check}
                onChange={() => handleToggleChange('enable_spell_check')}
                disabled={isSaving()}
              />
              <span>Enable Spell Check</span>
            </label>
            <p class={styles.help}>Check spelling as you type</p>
          </div>
        </section>

        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>Danger Zone</h2>

          <button
            type='button'
            class={styles.resetButton}
            onClick={handleReset}
            disabled={isSaving()}
          >
            Reset All Settings
          </button>
        </section>

        <Show when={isSaving()}>
          <div class={styles.savingIndicator}>Saving changes...</div>
        </Show>
      </div>
    </main>
  )
}
