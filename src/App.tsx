import { useState } from 'react'
import type { Project } from './content/portfolio'
import { profile } from './content/portfolio'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Icon } from './components/Icon'
import { ProjectDialog } from './components/ProjectDialog'
import { Projects } from './components/Projects'
import { useLocale } from './i18n/LocaleProvider'

export default function App() {
  const { messages } = useLocale()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <a className="skip-link" href="#main-content">{messages.skipToContent}</a>
      <div id="home" />
      <Header />
      <main id="main-content" className="container">
        <Hero />
        <Projects onSelect={setSelectedProject} />
        <About />
        <Contact />
      </main>
      <footer className="container site-footer">
        <p>© {new Date().getFullYear()} {profile.name || messages.footer.personalPortfolio}<span className="footer-separator">/</span>{messages.footer.note}</p>
        <a href="#home">{messages.footer.backToTop} <Icon name="arrow-up" /></a>
      </footer>
      {selectedProject && <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  )
}
