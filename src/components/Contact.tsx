import { profile, socialLinks } from '../content/portfolio'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { useLocale } from '../i18n/LocaleProvider'

export function Contact() {
  const { locale, messages } = useLocale()
  const visibleSocialLinks = socialLinks
    .map((link) => ({ ...link, url: typeof link.url === 'string' ? link.url : link.url[locale] }))
    .filter((link) => link.url.trim())

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
          {visibleSocialLinks.length > 0 && (
            <div className="social-links">
              {visibleSocialLinks.map((link) => (
                <a href={link.url} key={link.id} target="_blank" rel="noopener noreferrer">
                  <span className="social-icon" aria-hidden="true" style={{ maskImage: `url("${link.icon}")` }} />
                  {link.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
