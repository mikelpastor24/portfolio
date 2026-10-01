import { useLocale } from '../i18n/LocaleProvider'

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useLocale()
  return (
    <div className="language-switcher" role="group" aria-label={messages.language.choose}>
      <button lang="es" aria-label={messages.language.spanish} aria-pressed={locale === 'es'} onClick={() => setLocale('es')}>ES</button>
      <button lang="en" aria-label={messages.language.english} aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
    </div>
  )
}
