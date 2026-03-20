import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { consola } from 'consola'
import { createSignal } from 'solid-js'
import { Select, type SelectOption } from '#/components/select'
import { Toast } from '#/components/toast'
import type { ThemeName } from '#/schemas/settings.schema'
import { uiSettings } from '#/stores/settings.store'
import { updateUISettings, updateTheme } from '#/stores/settings.store'
import { SettingRow } from './-setting-row'

export const Route = createFileRoute('/(settings)/settings/appearance')({
  component: RouteComponent
})

function RouteComponent() {
  const ui = useStore(uiSettings)
  const [isSaving, setIsSaving] = createSignal(false)

  const isLightThemeDisabled = () => ui().theme_mode === 'dark' || isSaving()
  const isDarkThemeDisabled = () => ui().theme_mode === 'light' || isSaving()

  const lightThemeDescription = () => {
    switch (ui().theme_mode) {
      case 'light':
        return 'Theme used in light mode'
      case 'dark':
        return 'Not used in dark mode'
      default:
        return 'Theme used when system is in light mode'
    }
  }

  const darkThemeDescription = () => {
    switch (ui().theme_mode) {
      case 'dark':
        return 'Theme used in dark mode'
      case 'light':
        return 'Not used in light mode'
      default:
        return 'Theme used when system is in dark mode'
    }
  }

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
      await updateTheme(mode, value as ThemeName)
      showToast('success', `Theme updated successfully (${mode} mode: ${value})`)
    } catch (error) {
      consola.error('[Settings] Error in handleThemeChange:', error)
      showToast('error', 'Failed to update theme')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div class='px-5 pb-4 pt-0'>
      <header class='mb-6'>
        <h1 class='text-[15px] font-semibold text-foreground-neutral'>Appearance</h1>
        <p class='text-[11px] text-foreground-neutral-faded mt-0.5'>
          Customize the look and feel of the app
        </p>
      </header>

      <section>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Theme
        </h2>

        <SettingRow label='Theme Mode' description='Auto mode follows your system preference'>
          <Select
            value={ui().theme_mode}
            onChange={handleThemeModeChange}
            disabled={isSaving()}
            options={[
              { value: 'auto', label: 'Auto (System)' },
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' }
            ]}
          />
        </SettingRow>

        <SettingRow label='Light Theme' description={lightThemeDescription()}>
          <Select
            value={ui().theme_light}
            onChange={(option) => handleThemeChange('light', option)}
            disabled={isLightThemeDisabled()}
            options={[
              { value: 'default-light', label: 'Default Light' },
              { value: 'modern-light', label: 'Modern Light' }
            ]}
          />
        </SettingRow>

        <SettingRow label='Dark Theme' description={darkThemeDescription()}>
          <Select
            value={ui().theme_dark}
            onChange={(option) => handleThemeChange('dark', option)}
            disabled={isDarkThemeDisabled()}
            options={[
              { value: 'default-dark', label: 'Default Dark' },
              { value: 'modern-dark', label: 'Modern Dark' }
            ]}
          />
        </SettingRow>
      </section>
    </div>
  )
}
