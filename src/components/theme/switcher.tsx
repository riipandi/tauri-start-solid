import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/base-ui'
import { useTheme } from '#/context/hooks/use-theme'
import { Theme } from '#/context/stores/ui.store'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Select
      defaultValue={theme}
      onChange={(e) => setTheme(e as Theme)}
      options={['dark', 'light', 'system'] as Theme[]}
      itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
      placeholder="Select theme"
    >
      <SelectTrigger class="w-24">
        <SelectValue<Theme>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}
