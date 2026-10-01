import configuration from './portfolio.json' with { type: 'json' }
import type { Locale } from '../i18n/types.ts'

type LocalizedText = Record<Locale, string>
type Preview = 'portfolio' | 'concept'

export type SocialLink = {
  id: string
  name: string
  url: string | LocalizedText
  icon: string
}

export type Project = {
  id: string
  title: LocalizedText
  category: LocalizedText
  description: LocalizedText
  details: Record<Locale, string[]>
  technologies: string[]
  preview: Preview
  status: LocalizedText
  isExample: boolean
  url?: string
  repository?: string
}

function getPreview(value: string): Preview {
  if (value === 'portfolio' || value === 'concept') return value
  throw new Error(`Unknown project preview: ${value}. Use "portfolio" or "concept" in portfolio.json.`)
}

export const profile = configuration.profile
export const socialLinks: SocialLink[] = profile.socialLinks
export function formatProfileText(text: string) {
  return text.replaceAll('{name}', profile.name).replaceAll('{specialty}', profile.specialty)
}
export const principles = configuration.principles
export const projects: Project[] = configuration.projects.map((project) => ({ ...project, preview: getPreview(project.preview) }))
