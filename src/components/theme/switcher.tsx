import { useTheme } from '#/context/hooks/use-theme'
import { Theme } from '#/context/stores/ui.store'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div class="grid grid-cols-2 gap-1">
      <label for="theme-select" class="text-base">
        Select Theme:
      </label>
      <select
        id="theme-select"
        onInput={(e) => setTheme(e.currentTarget.value as Theme)}
        class="bg-background text-base"
        value={theme}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  )
}
