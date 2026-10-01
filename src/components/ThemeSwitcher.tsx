import { useLocale } from '../i18n/LocaleProvider'
import { useTheme } from '../theme/ThemeProvider'
import type { ThemePreference } from '../theme/ThemeProvider'
import { Icon } from './Icon'

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme()
  const { messages } = useLocale()
  const icon = preference === 'system' ? 'monitor' : preference === 'dark' ? 'moon' : 'sun'

  return (
    <label className="theme-switcher">
      <span className="sr-only">{messages.theme.label}</span>
      <Icon name={icon} />
      <select
        value={preference}
        onChange={(event) => setPreference(event.target.value as ThemePreference)}
        title={`${messages.theme.label}: ${messages.theme[preference]}`}
      >
        <option value="system">{messages.theme.system}</option>
        <option value="light">{messages.theme.light}</option>
        <option value="dark">{messages.theme.dark}</option>
      </select>
    </label>
  )
}
