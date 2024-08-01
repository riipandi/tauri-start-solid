import HotKeys from '@/hotkeys'

export function SettingShortcuts() {
  return (
    <div className="flex size-full flex-col justify-start">
      <h2 className="font-semibold text-base leading-6 dark:text-white">Keyboard Shortcuts</h2>
      <div className="custom-scrollbar mt-2 max-h-[460px] w-full overflow-auto pr-2">
        <ul className="space-y-2">
          {Object.entries(HotKeys).map(([key, hotKey]) => (
            <li key={key} className="flex flex-1 items-center justify-between">
              <span className="font-sans text-base text-neutral-800 dark:text-neutral-400">
                {hotKey.description}
              </span>
              <span className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 font-mono text-sm dark:border-neutral-500 dark:bg-neutral-800">
                {hotKey.key}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
