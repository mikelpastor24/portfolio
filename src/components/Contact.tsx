import { profile } from '../content/portfolio'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { useLocale } from '../i18n/LocaleProvider'

export function Contact() {
  const { locale, messages } = useLocale()
  const socialLinks = [
    { name: 'GitHub', url: profile.github },
    { name: 'LinkedIn', url: profile.linkedin[locale] },
  ].filter((link) => link.url)

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <Reveal className="contact-panel">
        <div>
          <p className="eyebrow">{messages.contact.eyebrow}</p>
          <h2 id="contact-heading">{messages.contact.heading}<br />{messages.contact.headingSecond} <span className="serif">{messages.contact.headingAccent}</span></h2>
          <p className="contact-description">{messages.contact.description}</p>
        </div>
        <div className="contact-actions">
          {profile.email ? (
            <a className="button button-primary" href={`mailto:${profile.email}`}>{messages.contact.cta} <Icon name="arrow-up-right" /></a>
          ) : (
            <div className="contact-pending">
              <span className="contact-symbol" aria-hidden="true"><Icon name="arrow-up-right" /></span>
              <p>{messages.contact.pending}<span>{messages.contact.pendingDescription}</span></p>
            </div>
          )}
          {socialLinks.length > 0 && (
            <div className="social-links">
              {socialLinks.map((link) => <a href={link.url} key={link.name} target="_blank" rel="noopener noreferrer">{link.name} <Icon name="arrow-up-right" /></a>)}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
