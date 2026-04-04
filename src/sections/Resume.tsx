import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

const Resume = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.animate-in')
    if (els) {
      animate(els, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 600,
        ease: 'outCubic',
      })
    }
  }, [])

  return (
    <section ref={sectionRef}>
      <h2 className="animate-in opacity-0 font-display text-5xl italic text-charcoal mb-6">
        resume
      </h2>

      <div className="animate-in opacity-0 bg-cream-dark rounded-2xl p-8 text-center space-y-6">
        <p className="font-body text-warm-gray">
          grab a copy of my resume below.
        </p>

        <a
          href="/resume-lei.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 rounded-full bg-gold text-charcoal font-body font-medium
                     hover:bg-gold-dark hover:shadow-lg hover:shadow-gold/30
                     transition-all duration-300"
        >
          view resume ↗
        </a>

        <div className="mt-8 rounded-xl overflow-hidden border border-charcoal/10">
          <embed
            src="/resume-lei.pdf"
            type="application/pdf"
            className="w-full h-[80vh]"
          />
        </div>
      </div>
    </section>
  )
}

export default Resume
