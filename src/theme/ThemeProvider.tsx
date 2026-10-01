import { createContext, useContext, useLayoutEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

function getInitialPreference(): ThemePreference {
  // theme-init.js has already read and applied the preference before React loads.
  const value = document.documentElement.dataset.themePreference
  return value === 'light' || value === 'dark' ? value : 'system'
}

function subscribeToSystemTheme(listener: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type ThemeContextValue = {
  preference: ThemePreference
  theme: Theme
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setCurrentPreference] = useState<ThemePreference>(getInitialPreference)
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme)
  const theme = preference === 'system' ? systemTheme : preference

  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.themePreference = preference
    root.dataset.theme = theme
    root.style.colorScheme = theme
    const background = getComputedStyle(root).getPropertyValue('--paper').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background)
  }, [preference, theme])

  const setPreference = (next: ThemePreference) => {
    setCurrentPreference(next)
    try {
      if (next === 'system') localStorage.removeItem('portfolio.theme')
      else localStorage.setItem('portfolio.theme', next)
    } catch { /* Theme changes still work when the preference cannot be saved. */ }
  }

  return <ThemeContext.Provider value={{ preference, theme, setPreference }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
