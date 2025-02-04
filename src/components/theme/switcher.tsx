import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/base-ui'
import { Theme } from '#/components/theme/provider'
import { useTheme } from '#/context/hooks/use-theme'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const themeOptions: Theme[] = ['dark', 'light', 'system']

  return (
    <Select
      value={theme()}
      onChange={(value) => setTheme(value as Theme)}
      itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
      options={themeOptions}
    >
      <SelectTrigger class="w-24">
        <SelectValue<Theme>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}
