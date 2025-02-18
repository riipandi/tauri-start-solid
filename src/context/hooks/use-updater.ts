import { listen } from '@tauri-apps/api/event'
import { createConsola } from 'consola/basic'
import { onCleanup, onMount } from 'solid-js'

interface UpdateStatus {
  status: string
  progress?: number
  error?: string
  timestamp: number
  formatted_time: string
}

export function createUpdateHandler() {
  const log = createConsola({ defaults: { tag: 'app-updater' } })

  onMount(() => {
    const unlistenUpdate = listen<UpdateStatus>('app-updater', (event) => {
      const { status, progress, error, formatted_time } = event.payload

      switch (status) {
        case 'downloading':
          log.info(formatted_time, `Downloading update: ${progress?.toFixed(2)}%`)
          break
        case 'ready':
          log.success(formatted_time, 'Update downloaded and ready to install')
          break
        case 'up-to-date':
          log.info(formatted_time, 'Application is up to date')
          break
        case 'error':
          log.error(formatted_time, error)
          break
      }
    })

    onCleanup(() => {
      unlistenUpdate.then((fn) => fn())
    })
  })
}
