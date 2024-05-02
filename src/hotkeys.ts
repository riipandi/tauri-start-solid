export type HotKey = {
  key: string
  description: string
}

export type HotKeyName =
  | 'close'
  | 'closeAll'
  | 'dataDir'
  | 'devTools'
  | 'logDir'
  | 'logFile'
  | 'reload'
  | 'settings'

const HotKeys: Record<HotKeyName, HotKey> = {
  close: { key: 'mod+w', description: 'Close window' },
  closeAll: { key: 'mod+shift+w', description: 'Close all open windows' },
  dataDir: { key: 'mod+alt+j', description: 'Open application data directory' },
  devTools: { key: 'mod+alt+i', description: 'Toggle development tools' },
  logDir: { key: 'mod+alt+l', description: 'Open application log directory' },
  logFile: { key: 'mod+/', description: 'Open application log file' },
  reload: { key: 'mod+shift+r', description: 'Reload the application' },
  settings: { key: 'mod+,', description: 'Open application settings' },
}

export default HotKeys
