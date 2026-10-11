import type { ProjectPackage } from '../content/portfolio'
import { useLocale } from '../i18n/LocaleProvider'
import { Icon } from './Icon'

export function ProjectPackageLinks({ packages }: { packages: ProjectPackage[] }) {
  const { messages } = useLocale()
  if (!packages.length) return null

  return (
    <div className="project-packages">
      <p className="project-packages-label">{messages.projects.packages}</p>
      <ul className="project-package-links" aria-label={messages.projects.packages}>
        {packages.map((packageLink) => (
          <li key={packageLink.url}>
            <a className="text-link" href={packageLink.url} target="_blank" rel="noopener noreferrer" aria-label={messages.projects.packageLink.replace('{name}', packageLink.name)}>
              {packageLink.name} <Icon name="arrow-up-right" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
