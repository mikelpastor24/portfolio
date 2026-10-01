import { useEffect, useRef, useState } from 'react'
import { profile } from '../content/portfolio'
import { Icon } from './Icon'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useLocale } from '../i18n/LocaleProvider'

export function Header() {
  const { messages } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 641px)')
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <a className="wordmark" href="#home" aria-label={messages.navigation.home}>
          {profile.name || messages.brand}<span className="wordmark-dot">.</span>
        </a>
        <div className="header-actions">
          <nav aria-label={messages.navigation.label}>
            <button
              className="menu-toggle icon-button"
              aria-label={menuOpen ? messages.navigation.closeMenu : messages.navigation.openMenu}
              aria-expanded={menuOpen}
              aria-controls="navigation-links"
              onClick={() => setMenuOpen(!menuOpen)}
              ref={toggleRef}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
            <div id="navigation-links" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
              <a href="#projects" onClick={() => setMenuOpen(false)}>{messages.navigation.projects}</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>{messages.navigation.about}</a>
              <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
                {messages.navigation.contact} <Icon name="arrow-up-right" />
              </a>
            </div>
          </nav>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
