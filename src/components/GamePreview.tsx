import { useLocale } from '../i18n/LocaleProvider'

export function GamePreview() {
  const { messages } = useLocale()
  return (
    <div className="project-visual visual-gamer" aria-hidden="true">
      <div className="game-preview-panel">
        <div className="preview-panel-heading"><strong>Jev</strong><span>TypeSafe</span></div>
        <div className="game-preview-screen">
          <div className="game-preview-title"><span>Pokémon</span><span>{messages.preview.gameGeneration}</span></div>
          <svg className="game-preview-map" viewBox="0 0 240 100" fill="none">
            <path d="M0 25H240M0 50H240M0 75H240M30 0V100M60 0V100M90 0V100M120 0V100M150 0V100M180 0V100M210 0V100" className="game-map-grid" />
            <path d="M30 75H90V50H150V25H210" className="game-map-route" />
            <rect x="48" y="13" width="24" height="24" rx="5" className="game-map-tile" />
            <rect x="108" y="63" width="24" height="24" rx="5" className="game-map-tile" />
            <rect x="168" y="63" width="24" height="24" rx="5" className="game-map-tile" />
            <circle cx="30" cy="75" r="8" className="game-map-player" />
            <circle cx="210" cy="25" r="8" className="game-map-goal" />
          </svg>
        </div>
        <div className="game-preview-decision"><span className="small-dot" /><span>{messages.preview.gameDecision}</span><span>→</span><span>{messages.preview.gameAction}</span></div>
      </div>
      <span className="visual-caption">{messages.preview.gameCaption}</span>
    </div>
  )
}
