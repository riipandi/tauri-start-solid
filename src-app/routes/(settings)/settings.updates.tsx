import { toaster } from '@kobalte/core/toast'
import { useStore } from '@nanostores/solid'
import { createFileRoute } from '@tanstack/solid-router'
import { getVersion } from '@tauri-apps/api/app'
import { consola } from 'consola'
import { createSignal, createEffect, onMount, Show } from 'solid-js'
import { Button } from '#/components/button'
import { Select, type SelectOption } from '#/components/select'
import { Switch } from '#/components/switch'
import { Toast } from '#/components/toast'
import { updaterService } from '#/services/updater.service'
import { updateUpdateSettings, updateSettingsStore } from '#/stores/settings'
import { SettingRow } from './-setting-row'

export const Route = createFileRoute('/(settings)/settings/updates')({
  component: RouteComponent
})

const UPDATE_CHANNEL_OPTIONS: SelectOption[] = [
  { value: 'stable', label: 'Stable' },
  { value: 'canary', label: 'Canary' }
]

const UPDATE_MODE_OPTIONS: SelectOption[] = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' }
]

function RouteComponent() {
  const update = useStore(updateSettingsStore)
  const [isSaving, setIsSaving] = createSignal(false)
  const [isChecking, setIsChecking] = createSignal(false)
  const [isDownloading, setIsDownloading] = createSignal(false)
  const [downloadProgress, setDownloadProgress] = createSignal(0)
  const [appVersion, setAppVersion] = createSignal('v0.0.0')
  const [lastCheck, setLastCheck] = createSignal<string | null>(null)
  const [availableUpdate, setAvailableUpdate] = createSignal<{
    version: string
    date: string
    notes: string
  } | null>(null)
  const [updateReady, setUpdateReady] = createSignal(false)

  function showToast(type: 'success' | 'error', message: string) {
    toaster.show((props) => <Toast toast={props} type={type} title={message} />)
  }

  // Load app version and update state on mount
  onMount(async () => {
    try {
      const version = await getVersion()
      setAppVersion(`v${version}`)

      const state = await updaterService.getUpdateState()
      if (state.last_check) {
        const checkDate = new Date(state.last_check)
        setLastCheck(formatRelativeTime(checkDate))
      }

      if (state.pending_version) {
        setAvailableUpdate({
          version: state.pending_version,
          date: state.pending_date ? new Date(state.pending_date).toLocaleDateString() : '',
          notes: state.pending_notes || ''
        })
        setUpdateReady(state.downloaded)
      }
    } catch (error) {
      consola.error('[Updates] Error loading update state:', error)
    }
  })

  // Listen for update events
  createEffect(() => {
    const unlistenPromises = [
      updaterService.onUpdateAvailable((info) => {
        setAvailableUpdate({
          version: info.version,
          date: info.date,
          notes: info.notes
        })
      }),
      updaterService.onDownloadProgress((event) => {
        if (event.event === 'Progress' && event.data) {
          const total = event.data.contentLength || 100
          const current = event.data.chunkLength || 0
          setDownloadProgress((current / total) * 100)
        } else if (event.event === 'Finished') {
          setDownloadProgress(100)
        }
      }),
      updaterService.onReadyToInstall(() => {
        setUpdateReady(true)
        setIsDownloading(false)
        showToast('success', 'Update downloaded and ready to install!')
      }),
      updaterService.onError((error) => {
        setIsChecking(false)
        setIsDownloading(false)
        showToast('error', error)
      })
    ]

    Promise.all(unlistenPromises).then((unlisteners) => {
      return () => {
        unlisteners.forEach((fn) => fn())
      }
    })
  })

  function formatRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  async function handleChannelChange(option: SelectOption | null) {
    if (!option) return
    setIsSaving(true)
    try {
      await updateUpdateSettings({ channel: option.value as 'stable' | 'canary' })
      showToast('success', `Update channel changed to ${option.label}`)
    } catch (error) {
      consola.error('[Updates] Error updating channel:', error)
      showToast('error', 'Failed to update channel')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleModeChange(option: SelectOption | null) {
    if (!option) return
    setIsSaving(true)
    try {
      await updateUpdateSettings({ mode: option.value as 'automatic' | 'manual' })
      showToast('success', `Update mode changed to ${option.label}`)
    } catch (error) {
      consola.error('[Updates] Error updating mode:', error)
      showToast('error', 'Failed to update mode')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAutoDownloadToggle(checked: boolean) {
    setIsSaving(true)
    try {
      await updateUpdateSettings({ auto_download: checked })
      showToast('success', checked ? 'Auto-download enabled' : 'Auto-download disabled')
    } catch (error) {
      consola.error('[Updates] Error toggling auto-download:', error)
      showToast('error', 'Failed to update auto-download setting')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleCheckUpdates() {
    setIsChecking(true)
    setAvailableUpdate(null)
    try {
      const updateInfo = await updaterService.checkForUpdates()
      setLastCheck(formatRelativeTime(new Date()))

      if (updateInfo) {
        setAvailableUpdate(updateInfo)
        showToast('success', `Update ${updateInfo.version} is available!`)
      } else {
        showToast('success', 'You are on the latest version')
      }
    } catch (error) {
      consola.error('[Updates] Error checking for updates:', error)
      showToast('error', 'Failed to check for updates')
    } finally {
      setIsChecking(false)
    }
  }

  async function handleDownloadUpdate() {
    setIsDownloading(true)
    setDownloadProgress(0)
    try {
      await updaterService.downloadUpdate((event) => {
        if (event.event === 'Progress' && event.data) {
          const total = event.data.contentLength || 100
          const current = event.data.chunkLength || 0
          setDownloadProgress((prev) => prev + (current / total) * 100)
        }
      })
    } catch (error) {
      consola.error('[Updates] Error downloading update:', error)
      showToast('error', 'Failed to download update')
      setIsDownloading(false)
    }
  }

  async function handleInstallUpdate() {
    try {
      await updaterService.installUpdate()
      showToast('success', 'Update will be installed on restart')
    } catch (error) {
      consola.error('[Updates] Error installing update:', error)
      showToast('error', 'Failed to install update')
    }
  }

  return (
    <div class='px-5 pb-4 pt-0'>
      <header class='mb-6'>
        <h1 class='text-[15px] font-semibold text-foreground-neutral'>Updates</h1>
        <p class='text-[11px] text-foreground-neutral-faded mt-0.5'>
          Configure application updates and channels
        </p>
      </header>

      <section class='mb-6'>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Update Channel
        </h2>
        <SettingRow label='Channel' description='Choose which update channel to use'>
          <Select
            value={update().channel}
            onChange={handleChannelChange}
            options={UPDATE_CHANNEL_OPTIONS}
            disabled={isSaving()}
          />
        </SettingRow>
        <Show when={update().channel === 'canary'}>
          <div class='px-4 py-2 bg-warning/10 border border-warning/20 rounded-md mt-2'>
            <p class='text-[11px] text-warning'>
              ⚠️ Canary versions may contain bugs and unstable features. Use at your own risk.
            </p>
          </div>
        </Show>
      </section>

      <section class='mb-6'>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Update Behavior
        </h2>
        <SettingRow
          label='Update Mode'
          description={
            update().mode === 'automatic'
              ? 'Automatically check for updates daily'
              : 'Manually check for updates'
          }
        >
          <Select
            value={update().mode}
            onChange={handleModeChange}
            options={UPDATE_MODE_OPTIONS}
            disabled={isSaving()}
          />
        </SettingRow>

        <Show when={update().mode === 'automatic'}>
          <SettingRow
            label='Auto Download'
            description='Automatically download updates when available'
          >
            <Switch
              checked={update().auto_download}
              onChange={handleAutoDownloadToggle}
              disabled={isSaving()}
            />
          </SettingRow>
        </Show>
      </section>

      <section class='mb-6'>
        <h2 class='text-[13px] font-medium text-foreground-neutral mb-3 pb-2 border-b border-border-neutral'>
          Current Version
        </h2>
        <div class='flex items-center justify-between gap-4 py-2'>
          <div class='flex-1 min-w-0'>
            <div class='text-[13px] font-medium text-foreground-neutral'>{appVersion()}</div>
            <Show when={lastCheck()}>
              <div class='text-[11px] text-foreground-neutral-faded mt-0.5'>
                Last checked: {lastCheck()}
              </div>
            </Show>
          </div>
          <Button
            variant='secondary'
            onClick={handleCheckUpdates}
            disabled={isChecking() || isDownloading() || isSaving()}
          >
            {isChecking() ? 'Checking...' : 'Check for Updates'}
          </Button>
        </div>

        <Show when={availableUpdate() && !updateReady()}>
          <div class='mt-4 p-4 bg-success/10 border border-border-positive/50 rounded-md'>
            <div class='flex items-start justify-between gap-4'>
              <div class='flex-1 min-w-0'>
                <div class='text-[13px] font-medium text-success'>
                  ✨ Update Available: {availableUpdate()?.version}
                </div>
                <Show when={availableUpdate()?.notes}>
                  <p class='text-[11px] text-foreground-neutral-faded mt-1'>
                    {availableUpdate()?.notes}
                  </p>
                </Show>
              </div>
              <Button
                variant='primary'
                onClick={handleDownloadUpdate}
                disabled={isDownloading() || isSaving()}
              >
                {isDownloading() ? 'Downloading...' : 'Download Update'}
              </Button>
            </div>
            <Show when={isDownloading() && downloadProgress() > 0}>
              <div class='mt-3'>
                <div class='flex items-center justify-between text-[11px] text-foreground-neutral-faded mb-1'>
                  <span>Downloading...</span>
                  <span>{Math.round(downloadProgress())}%</span>
                </div>
                <div class='w-full bg-background-neutral rounded-full h-1.5 overflow-hidden'>
                  <div
                    class='bg-success h-full transition-all duration-300'
                    style={{ width: `${downloadProgress()}%` }}
                  />
                </div>
              </div>
            </Show>
          </div>
        </Show>

        <Show when={updateReady()}>
          <div class='mt-4 p-4 bg-success/10 border border-border-positive/50 rounded-md'>
            <div class='flex items-start justify-between gap-4'>
              <div class='flex-1 min-w-0'>
                <div class='text-[13px] font-medium text-success'>
                  ✅ Update Ready: {availableUpdate()?.version}
                </div>
                <p class='text-[11px] text-foreground-neutral-faded mt-1'>
                  The update has been downloaded and is ready to install. Restart the app to apply.
                </p>
              </div>
              <Button variant='primary' onClick={handleInstallUpdate} disabled={isSaving()}>
                Install & Restart
              </Button>
            </div>
          </div>
        </Show>
      </section>
    </div>
  )
}
