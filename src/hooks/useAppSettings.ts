import { useEffect, useState, useMemo, useDeferredValue } from 'react'
import { invoke } from '@tauri-apps/api/core'

import { getAppSettings } from '@/utils/settings'
import type { AppSettings } from '@/types/bindings'

export const useAppSettings = () => {
  const [appSettings, setAppSettings] = useState<AppSettings>()
  const settingsValue = useDeferredValue(appSettings)

  useEffect(() => {
    getAppSettings().then(setAppSettings)
  }, [])

  const saveSetting = useMemo(
    () => async (param: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
      await invoke('save_setting', { param, value: value?.toString() })
    },
    []
  )

  return { ...settingsValue, saveSetting }
}
