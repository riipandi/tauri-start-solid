import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { consola } from 'consola'
import { createSignal, createResource } from 'solid-js'
import { FontPreview } from '#/components/font-preview'
import { FontSizeInput } from '#/components/font-size-input'
import { Select, type SelectOption } from '#/components/select'
import { Toast } from '#/components/toast'
import type { ThemeName } from '#/schemas/settings.schema'
import { fontsService } from '#/services/fonts.service'
import { uiSettings } from '#/stores/settings.store'
import {
  updateEditorFontSettings,
  updateTheme,
  updateUIFontSettings,
  updateUISettings
} from '#/stores/settings.store'
import { SettingRow } from './-setting-row'

export const Route = createFileRoute('/(settings)/settings/appearance')({
  component: RouteComponent
})

function RouteComponent() {
  const ui = useStore(uiSettings)
  const [isSaving, setIsSaving] = createSignal(false)

  // Load font lists
  const [uiFonts] = createResource(() => fontsService.getAvailableUIFonts())
  const [editorFonts] = createResource(() => fontsService.getAvailableEditorFonts())

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
      consola.error('[Settings] Error updating theme mode:', error)
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
      consola.error('[Settings] Error updating theme:', error)
      showToast('error', 'Failed to update theme')
    } finally {
      setIsSaving(false)
    }
  }

  // Font change handlers
  async function handleUIFontChange(option: SelectOption | null) {
    if (!option) return
    setIsSaving(true)
    try {
      await updateUIFontSettings({ family: option.value })
      showToast('success', 'UI font updated successfully')
    } catch (error) {
      consola.error('[Settings] Error updating UI font:', error)
      showToast('error', 'Failed to update UI font')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleEditorFontChange(option: SelectOption | null) {
    if (!option) return
    setIsSaving(true)
    try {
      await updateEditorFontSettings({ family: option.value })
      showToast('success', 'Editor font updated successfully')
    } catch (error) {
      consola.error('[Settings] Error updating editor font:', error)
      showToast('error', 'Failed to update editor font')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUISizeChange(size: number) {
    setIsSaving(true)
    try {
      await updateUIFontSettings({ size })
    } catch (error) {
      consola.error('[Settings] Error updating UI font size:', error)
      showToast('error', 'Failed to update font size')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleEditorSizeChange(size: number) {
    setIsSaving(true)
    try {
      await updateEditorFontSettings({ size })
    } catch (error) {
      consola.error('[Settings] Error updating editor font size:', error)
      showToast('error', 'Failed to update font size')
    } finally {
      setIsSaving(false)
    }
  }

  // Build UI font options
  const uiFontOptions = () => {
    const options: SelectOption[] = [{ value: 'system-ui', label: 'System UI' }]

    if (uiFonts()) {
      const fonts = uiFonts()!
      for (const font of fonts) {
        options.push({ value: font.family, label: font.full_name })
      }
    }

    return options
  }

  // Build editor font options
  const editorFontOptions = () => {
    const options: SelectOption[] = [{ value: 'monospace', label: 'Monospace (Default)' }]

    if (editorFonts()) {
      const fonts = editorFonts()!
      for (const font of fonts) {
        options.push({ value: font.family, label: font.full_name })
      }
    }

    return options
  }

  return (
    <div class='px-5 pb-4 pt-0'>
      <header class='mb-6'>
        <h1 class='text-[15px] font-semibold text-foreground-neutral'>Appearance</h1>
        <p class='text-[11px] text-foreground-neutral-faded mt-0.5'>
          Customize the look and feel of the app
        </p>
      </header>

      <section class='mb-6'>
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

      <section>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Typography
        </h2>

        <SettingRow label='UI Font Family' description='Font used for application interface'>
          <Select
            value={ui().ui_font_family}
            onChange={handleUIFontChange}
            disabled={isSaving() || uiFonts.loading}
            options={uiFontOptions()}
          />
        </SettingRow>

        <SettingRow label='UI Font Size' description='Interface text size in pixels'>
          <FontSizeInput
            value={ui().ui_font_size}
            onChange={handleUISizeChange}
            disabled={isSaving()}
            min={10}
            max={24}
          />
        </SettingRow>

        <FontPreview
          family={ui().ui_font_family}
          size={ui().ui_font_size}
          text='The quick brown fox jumps over the lazy dog'
          class='mb-4'
        />

        <SettingRow label='Editor Font Family' description='Monospace font for code editing'>
          <Select
            value={ui().editor_font_family}
            onChange={handleEditorFontChange}
            disabled={isSaving() || editorFonts.loading}
            options={editorFontOptions()}
          />
        </SettingRow>

        <SettingRow label='Editor Font Size' description='Code editor text size in pixels'>
          <FontSizeInput
            value={ui().editor_font_size}
            onChange={handleEditorSizeChange}
            disabled={isSaving()}
            min={10}
            max={24}
          />
        </SettingRow>

        <FontPreview
          family={ui().editor_font_family}
          size={ui().editor_font_size}
          text='function example() { const λ = (x) => x * 2; return λ(42); }'
          isMonospace={true}
          class='mb-4'
        />
      </section>
    </div>
  )
}
