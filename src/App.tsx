import { useState, useRef, useEffect } from 'react'
import { animate, stagger } from 'animejs'
import Home from './sections/Home'
import About from './sections/About'
import Projects from './sections/Projects'
import Dashboard from './sections/Dashboard'
import Resume from './sections/Resume'

const tabs = [
  { id: 'home', label: 'home' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'dashboard', label: 'dashboard' },
  { id: 'resume', label: 'resume' },
] as const

type TabId = (typeof tabs)[number]['id']

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const contentRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Animate content on tab change
  useEffect(() => {
    if (contentRef.current) {
      animate(contentRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        ease: 'outCubic',
      })
    }
  }, [activeTab])

  // Staggered chip entrance on mount
  useEffect(() => {
    animate(chipRefs.current.filter(Boolean), {
      opacity: [0, 1],
      translateY: [15, 0],
      delay: stagger(80, { start: 300 }),
      duration: 600,
      ease: 'outCubic',
    })
  }, [])

  const renderSection = () => {
    switch (activeTab) {
      case 'home': return <Home />
      case 'about': return <About />
      case 'projects': return <Projects />
      case 'dashboard': return <Dashboard />
      case 'resume': return <Resume />
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation chips */}
      <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-charcoal/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('home')}
            className="font-display text-2xl italic text-charcoal hover:text-gold-dark transition-colors cursor-pointer"
          >
            lay's
          </button>

          {/* Chip tabs */}
          <div className="flex gap-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => { chipRefs.current[i] = el }}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  opacity-0 px-4 py-1.5 rounded-full text-sm font-body tracking-wide
                  transition-all duration-300 cursor-pointer
                  ${activeTab === tab.id
                    ? 'bg-gold text-charcoal shadow-md shadow-gold/30 scale-105'
                    : 'bg-cream-dark text-warm-gray hover:bg-gold-light hover:text-charcoal'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content area */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div ref={contentRef}>
          {renderSection()}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-charcoal/5">
        <p className="text-warm-gray text-sm text-center font-body">
          lei wu © {new Date().getFullYear()} · betcha can't visit just once
        </p>
      </footer>
    </div>
  )
}

export default App
