import { useState, useRef, useEffect } from 'react'
import { animate, stagger } from 'animejs'
import Projects from './sections/Projects'
import GitHubHeatmap from './components/GitHubHeatmap'
import StravaHeatmap from './components/StravaHeatmap'
import SpotifyStats from './components/SpotifyNow'

const tabs = [
  { id: 'home', label: 'home' },
  { id: 'projects', label: 'projects' },
] as const

type TabId = (typeof tabs)[number]['id']

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const contentRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      animate(contentRef.current, { opacity: [0, 1], translateY: [12, 0], duration: 400, ease: 'outCubic' })
    }
  }, [activeTab])

  useEffect(() => {
    if (navRef.current) {
      animate(navRef.current.querySelectorAll('.nav-item'), {
        opacity: [0, 1], translateX: [-10, 0], delay: stagger(80, { start: 200 }), duration: 500, ease: 'outCubic',
      })
    }
    if (socialRef.current) {
      animate(socialRef.current.children, {
        opacity: [0, 1], scale: [0.5, 1], delay: stagger(80, { start: 400 }), duration: 400, ease: 'outCubic',
      })
    }
  }, [])

  return (
    <div className="h-screen bg-cream flex overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

      {/* Side nav — hidden on mobile */}
      <nav ref={navRef} className="hidden md:flex flex-col justify-between py-8 px-4 border-r border-charcoal/5 w-40 flex-shrink-0">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`nav-item opacity-0 block w-full text-left px-3 py-2 text-sm font-body tracking-wide transition-all duration-200 cursor-pointer
                ${activeTab === tab.id ? 'bg-gold/20 text-charcoal font-medium' : 'text-warm-gray hover:text-charcoal hover:bg-cream-dark'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div ref={socialRef} className="flex gap-3 px-2">
          <a href="https://github.com/imreallynameless" target="_blank" rel="noopener noreferrer" className="opacity-0 text-warm-gray hover:text-charcoal transition-colors"><GitHubIcon /></a>
          <a href="https://www.linkedin.com/in/leiwuhoo/" target="_blank" rel="noopener noreferrer" className="opacity-0 text-warm-gray hover:text-charcoal transition-colors"><LinkedInIcon /></a>
          <a href="https://x.com/ujustgotleid" target="_blank" rel="noopener noreferrer" className="opacity-0 text-warm-gray hover:text-charcoal transition-colors"><TwitterIcon /></a>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-sm border-b border-charcoal/5 px-4 py-2 flex justify-between items-center">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-body cursor-pointer ${activeTab === tab.id ? 'bg-gold/20 text-charcoal font-medium' : 'text-warm-gray'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <a href="https://github.com/imreallynameless" target="_blank" rel="noopener noreferrer" className="text-warm-gray"><GitHubIcon /></a>
          <a href="https://www.linkedin.com/in/leiwuhoo/" target="_blank" rel="noopener noreferrer" className="text-warm-gray"><LinkedInIcon /></a>
          <a href="https://x.com/ujustgotleid" target="_blank" rel="noopener noreferrer" className="text-warm-gray"><TwitterIcon /></a>
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-4 md:p-5 pt-14 md:pt-5">
        <div ref={contentRef} className="h-full">
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'projects' && <Projects />}
        </div>
      </main>
    </div>
  )
}

function HomeContent() {
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate whichever is visible
    const animateCells = (container: HTMLElement | null) => {
      if (!container) return
      const cells = container.querySelectorAll('.cell')
      if (cells.length) {
        animate(cells, {
          opacity: [0, 1], translateY: [15, 0], delay: stagger(60), duration: 500, ease: 'outCubic',
        })
      }
    }
    animateCells(desktopRef.current)
    animateCells(mobileRef.current)
  }, [])

  const nameBlock = (
    <>
      <h1 className="font-display text-2xl text-charcoal leading-tight">
        lei <span className="italic text-gold-dark">(lay)</span> wu
      </h1>
      <p className="font-body text-xs text-warm-gray mt-0.5">
        cs @ carleton · i like to build fun stuff
      </p>
    </>
  )

  return (
    <>
      {/* Desktop: bento grid */}
      <div ref={desktopRef} className="hidden md:grid h-full gap-3"
        style={{
          gridTemplateColumns: '5fr 4fr 3fr',
          gridTemplateRows: 'auto 1fr',
        }}>
        <div className="cell col-span-3">{nameBlock}</div>
        <div className="cell overflow-auto pr-2"><SpotifyStats /></div>
        <div className="cell"><GitHubHeatmap /></div>
        <div className="cell"><StravaHeatmap /></div>
      </div>

      {/* Mobile: vertical scroll */}
      <div ref={mobileRef} className="md:hidden space-y-4 overflow-auto h-full pb-8">
        <div className="cell">{nameBlock}</div>
        <div className="cell"><SpotifyStats /></div>
        <div className="cell"><GitHubHeatmap /></div>
        <div className="cell"><StravaHeatmap /></div>
      </div>
    </>
  )
}

export default App
