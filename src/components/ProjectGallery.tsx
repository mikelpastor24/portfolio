import { useEffect, useRef, useState } from 'react'
import type { ProjectMedia } from '../content/portfolio'
import { useLocale } from '../i18n/LocaleProvider'
import { Icon } from './Icon'

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const { locale, messages } = useLocale()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const selected = media[selectedIndex]

  useEffect(() => {
    const video = videoRef.current
    return () => video?.pause()
  }, [selected?.src])

  if (!selected) return null
  const selectMedia = (index: number) => {
    videoRef.current?.pause()
    setHasError(false)
    setSelectedIndex(index)
  }

  return (
    <section className="project-gallery" aria-label={messages.media.gallery}>
      <figure className="project-media-current">
        <div className="project-media-stage">
          {selected.type === 'video' ? (
            <video ref={videoRef} key={selected.src} src={selected.src} poster={selected.poster} controls playsInline preload="none" tabIndex={0} aria-label={selected.title[locale]} onError={() => setHasError(true)}>
              <a href={selected.src}>{messages.media.openFile}</a>
            </video>
          ) : (
            <img key={selected.src} src={selected.src} alt={selected.title[locale]} decoding="async" onError={() => setHasError(true)} />
          )}
        </div>
        <figcaption>{selected.title[locale]}</figcaption>
      </figure>
      {hasError && <p className="project-media-error" role="status">{messages.media.error} <a href={selected.src} target="_blank" rel="noopener noreferrer">{messages.media.openFile}</a></p>}
      {media.length > 1 && (
        <div className="project-media-selector" role="group" aria-label={messages.media.choose}>
          {media.map((item, index) => (
            <button key={item.src} className="project-media-option" type="button" aria-label={item.title[locale]} aria-pressed={selectedIndex === index} onClick={() => selectMedia(index)}>
              <span className="project-media-option-preview" aria-hidden="true">
                {(item.type === 'image' || item.poster) && <img src={item.type === 'image' ? item.src : item.poster} alt="" loading="lazy" decoding="async" />}
                {item.type === 'video' && <Icon name="play" />}
              </span>
              <span className="project-media-option-title">{item.title[locale]}<span>{item.type === 'video' ? messages.media.video : messages.media.image}</span></span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
