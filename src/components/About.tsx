import { principles, profile } from '../content/portfolio'
import { Reveal } from './Reveal'
import { useLocale } from '../i18n/LocaleProvider'

export function About() {
  const { locale, messages } = useLocale()
  return (
    <section id="about" className="about-section section" aria-labelledby="about-heading">
      <Reveal className="about-grid">
        <div>
          <p className="eyebrow">{messages.about.eyebrow}</p>
          <h2 id="about-heading">{messages.about.heading}<br /><span className="serif">{messages.about.headingAccent}</span></h2>
          <div className="about-note"><span className="small-dot" /> {messages.about.note}</div>
        </div>
        <div className="about-copy">
          {profile.about[locale].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {profile.aboutIsPlaceholder && <p className="placeholder-note">{messages.about.placeholder}</p>}
          <div className="principles">
            {principles.map((principle, index) => (
              <div className="principle" key={index}>
                <span className="principle-number">0{index + 1}</span>
                <div><h3>{principle.title[locale]}</h3><p>{principle.description[locale]}</p></div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
