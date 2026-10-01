import { Icon } from './Icon'
import { profile } from '../content/portfolio'
import { useLocale } from '../i18n/LocaleProvider'

export function Hero() {
  const { messages } = useLocale()
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow hero-intro"><span className="small-dot" /> {profile.specialty.toUpperCase()}</p>
        <h1 id="hero-heading" className="hero-title">
          {messages.hero.title}<br /><span className="serif">{messages.hero.titleAccent}</span>
        </h1>
        <p className="hero-description">
          {messages.hero.description}<br />
          {messages.hero.descriptionSecond}
        </p>
        <a href="#projects" className="button button-primary">
          {messages.hero.explore} <Icon name="arrow-down" />
        </a>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbital-art">
          <svg viewBox="0 0 280 280" fill="none">
            <circle cx="140" cy="140" r="101" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="140" cy="140" rx="50" ry="101" stroke="currentColor" strokeWidth="1" transform="rotate(45 140 140)" />
            <ellipse cx="140" cy="140" rx="50" ry="101" stroke="currentColor" strokeWidth="1" transform="rotate(-45 140 140)" />
            <circle cx="140" cy="140" r="5" fill="currentColor" />
            <circle cx="211.5" cy="68.5" r="7" fill="#cad8a5" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span className="art-cross art-cross-top">+</span>
          <span className="art-cross art-cross-bottom">+</span>
        </div>
        <p>{messages.hero.artFirst}<br />{messages.hero.artSecond}</p>
      </div>
      <div className="hero-footnote">
        <span>{messages.hero.footnote}</span>
        <span>{messages.hero.scroll} <Icon name="arrow-down" /></span>
      </div>
    </section>
  )
}
