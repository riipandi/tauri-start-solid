import HotKeys from '@/hotkeys'

export function SettingShortcuts() {
  return (
    <div className="flex flex-col size-full justify-start">
      <h2 className="text-base font-semibold leading-6 dark:text-white">Keyboard Shortcuts</h2>
      <div className="w-full max-h-[460px] overflow-auto mt-2 custom-scrollbar pr-2">
        <ul className="space-y-2">
          {Object.entries(HotKeys).map(([key, hotKey]) => (
            <li key={key} className="flex flex-1 justify-between items-center">
              <span className="font-sans text-base text-neutral-800 dark:text-neutral-400">
                {hotKey.description}
              </span>
              <span className="font-mono border border-neutral-300 bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-800 py-0.5 px-2 rounded text-sm">
                {hotKey.key}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
