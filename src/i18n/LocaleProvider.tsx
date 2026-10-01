import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { formatProfileText, profile } from '../content/portfolio'
import spanish from './locales/es.json'
import english from './locales/en.json'
import type { Locale } from './types'

const translations: Record<Locale, typeof spanish> = { es: spanish, en: english }
const storageKey = 'portfolio.locale'

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en'
}

function getInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(storageKey)
    if (isLocale(saved)) return saved
  } catch { /* Language selection still works when storage is unavailable. */ }
  for (const language of navigator.languages ?? [navigator.language]) {
    const locale = language.split('-')[0].toLowerCase()
    if (isLocale(locale)) return locale
  }
  return 'en'
}

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; messages: typeof spanish }
const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setCurrentLocale] = useState<Locale>(getInitialLocale)
  const messages = translations[locale]
  const setLocale = (nextLocale: Locale) => {
    setCurrentLocale(nextLocale)
    try { localStorage.setItem(storageKey, nextLocale) } catch { /* Saving the selection is optional. */ }
  }

  useEffect(() => {
    const title = profile.name ? `${profile.name} — ${profile.specialty}` : messages.footer.personalPortfolio
    const description = formatProfileText(messages.meta.description)
    document.documentElement.lang = locale
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', messages.meta.ogLocale)
  }, [locale, messages])

  return <LocaleContext.Provider value={{ locale, setLocale, messages }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used inside LocaleProvider')
  return context
}
