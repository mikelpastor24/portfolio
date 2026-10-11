import type { Project } from '../content/portfolio'
import { useLocale } from '../i18n/LocaleProvider'
import { Icon } from './Icon'
import { ProjectPreview } from './ProjectPreview'

export function ProjectThumbnail({ project }: { project: Project }) {
  const { messages } = useLocale()
  const firstMedia = project.media[0]
  const image = project.cover || (firstMedia?.type === 'image' ? firstMedia.src : firstMedia?.poster)
  if (!image) return <ProjectPreview variant={project.preview} />

  return (
    <div className="project-visual project-media-cover" aria-hidden="true">
      <img src={image} alt="" loading="lazy" decoding="async" />
      {firstMedia?.type === 'video' && <span className="project-video-badge"><Icon name="play" />{messages.media.video}</span>}
    </div>
  )
}
