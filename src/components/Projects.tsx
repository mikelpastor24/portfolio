import { projects } from '../content/portfolio'
import type { Project } from '../content/portfolio'
import { Icon } from './Icon'
import { ProjectPreview } from './ProjectPreview'
import { Reveal } from './Reveal'
import { useLocale } from '../i18n/LocaleProvider'

export function Projects({ onSelect }: { onSelect: (project: Project) => void }) {
  const { locale, messages } = useLocale()
  return (
    <section id="projects" className="projects-section section" aria-labelledby="projects-heading">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">{messages.projects.eyebrow}</p>
          <h2 id="projects-heading">{messages.projects.heading}<span className="accent-dot">.</span></h2>
        </div>
        <p className="section-aside">{messages.projects.asideFirst}<br />{messages.projects.asideSecond}</p>
      </Reveal>
      <div className="project-grid">
        {projects.map((project, index) => (
          <Reveal key={project.id}>
            <article className="project-card">
              <button className="project-open" onClick={() => onSelect(project)} aria-label={`${messages.projects.view} ${project.title[locale]}`}>
                <div className="project-image-wrap">
                  <ProjectPreview variant={project.preview} />
                  <span className="project-image-action"><Icon name="arrow-up-right" /></span>
                  {project.isExample && <span className="example-label">{messages.projects.example}</span>}
                </div>
              </button>
              <div className="project-heading"><h3>{project.title[locale]}</h3><span className="project-number">{String(index + 1).padStart(2, '0')}</span></div>
              <div className="project-meta"><span>{project.category[locale]}</span><span className="meta-separator">/</span><span>{project.status[locale]}</span></div>
              <p className="project-description">{project.description[locale]}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
