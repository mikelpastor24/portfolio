import { useEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Project } from '../content/portfolio'
import { Icon } from './Icon'
import { ProjectPreview } from './ProjectPreview'
import { ProjectGallery } from './ProjectGallery'
import { useLocale } from '../i18n/LocaleProvider'

export function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { locale, messages } = useLocale()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const close = () => dialogRef.current?.close()
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], video[controls]'))
      .filter((element) => element.getClientRects().length > 0)
    const first = elements[0]
    const last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
  }

  return (
    <dialog ref={dialogRef} className="project-dialog" aria-labelledby="dialog-title" onClose={(event) => { if (!event.currentTarget.open) onClose() }} onClick={onBackdropClick} onKeyDown={trapFocus}>
      <button className="dialog-close icon-button" aria-label={messages.dialog.close} onClick={close} autoFocus><Icon name="close" /></button>
      {project.media.length ? <ProjectGallery media={project.media} /> : <ProjectPreview variant={project.preview} />}
      <div className="dialog-content">
        <p className="eyebrow">{project.isExample ? messages.dialog.example : project.category[locale].toUpperCase()}</p>
        <h2 id="dialog-title">{project.title[locale]}</h2>
        {project.details[locale].map((paragraph) => <p className="dialog-paragraph" key={paragraph}>{paragraph}</p>)}
        <ul className="technology-list" aria-label={messages.dialog.technologies}>
          {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {(project.url || project.repository) && (
          <div className="dialog-links">
            {project.url && <a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">{messages.dialog.visit} <Icon name="arrow-up-right" /></a>}
            {project.repository && <a className="text-link" href={project.repository} target="_blank" rel="noopener noreferrer">{messages.dialog.code} <Icon name="arrow-up-right" /></a>}
          </div>
        )}
      </div>
    </dialog>
  )
}
