import type { Project } from '../content/portfolio'
import { useLocale } from '../i18n/LocaleProvider'
import { GamePreview } from './GamePreview'
import { SchemaPreview } from './SchemaPreview'

export function ProjectPreview({ variant }: { variant: Project['preview'] }) {
  const { messages } = useLocale()
  if (variant === 'gamer') return <GamePreview />
  if (variant === 'schema') return <SchemaPreview />
  if (variant === 'concept') {
    return (
      <div className="project-visual visual-concept" aria-hidden="true">
        <div className="concept-paper">
          <span className="concept-caption">{messages.preview.conceptCaption}</span>
          <span className="concept-title">Quiet<br /><i>form.</i></span>
          <div className="concept-shape"><div /></div>
          <div className="concept-footer"><span>{messages.preview.conceptFooter}</span><span>↗</span></div>
        </div>
        <span className="visual-caption">{messages.preview.conceptVisualCaption}</span>
      </div>
    )
  }

  return (
    <div className="project-visual visual-portfolio" aria-hidden="true">
      <div className="mini-browser">
        <div className="mini-toolbar"><span /><span /><span /><i>portfolio / home</i></div>
        <div className="mini-site">
          <div className="mini-header"><strong>portfolio<span>.</span></strong><span>{messages.navigation.projects} &nbsp; {messages.navigation.about} &nbsp; {messages.navigation.contact} ↗</span></div>
          <div className="mini-content">
            <span className="mini-eyebrow">{messages.preview.personalSpace}</span>
            <span className="mini-title">{messages.hero.title}<br /><i>{messages.hero.titleAccent}</i></span>
            <span className="mini-description">{messages.hero.description}</span>
            <span className="mini-button">{messages.hero.explore} &nbsp; ↓</span>
          </div>
          <svg className="mini-orbit" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="35" stroke="currentColor" />
            <ellipse cx="50" cy="50" rx="18" ry="35" stroke="currentColor" transform="rotate(45 50 50)" />
            <ellipse cx="50" cy="50" rx="18" ry="35" stroke="currentColor" transform="rotate(-45 50 50)" />
          </svg>
        </div>
      </div>
      <span className="visual-caption">{messages.preview.portfolioCaption}</span>
    </div>
  )
}
