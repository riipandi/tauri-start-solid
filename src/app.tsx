import { BrowserRouter, useRoutes } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/core'
import { useHotkeys } from 'react-hotkeys-hook'
import { message } from '@tauri-apps/plugin-dialog'

import { PrimaryLayout, SettingsLayout } from '@/components/layouts'

import {
  SettingAbout,
  SettingAppearance,
  SettingChangelog,
  SettingGeneral,
  SettingShortcuts,
  SettingUpdates,
} from '@/screens/settings'
import WelcomeScreen from '@/screens/welcome'
import { NotFound } from '@/screens/_errors'

import HotKeys from '@/hotkeys'

const AppRoutes = () => {
  return useRoutes([
    {
      element: <PrimaryLayout />,
      children: [{ path: '/', element: <WelcomeScreen /> }],
    },
    {
      element: <SettingsLayout />,
      children: [
        { path: '/settings', element: <SettingGeneral /> },
        { path: '/settings/appearance', element: <SettingAppearance /> },
        { path: '/settings/updates', element: <SettingUpdates /> },
        { path: '/settings/shortcuts', element: <SettingShortcuts /> },
        { path: '/settings/changelog', element: <SettingChangelog /> },
        { path: '/settings/about', element: <SettingAbout /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ])
}

export default function App() {
  // Register keyboard shortcuts.
  // @ref: https://react-hotkeys-hook.vercel.app/docs/documentation/useHotkeys/basic-usage
  useHotkeys(HotKeys.settings.key, () => invoke('open_settings_window'), { splitKey: '|' })
  useHotkeys(HotKeys.devTools.key, () => invoke('toggle_devtools'))
  useHotkeys(HotKeys.logFile.key, () => invoke('open_log_file'))
  useHotkeys(HotKeys.logDir.key, () => invoke('open_log_directory'))
  useHotkeys(HotKeys.dataDir.key, () => invoke('open_data_directory'))
  useHotkeys(HotKeys.reload.key, () => window.location.reload())
  useHotkeys([HotKeys.close.key, HotKeys.closeAll.key], () => message('Not yet implemented.'))

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
