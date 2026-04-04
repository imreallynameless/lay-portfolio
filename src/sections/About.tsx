import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.animate-in')
    if (els) {
      animate(els, {
        opacity: [0, 1],
        translateY: [25, 0],
        delay: stagger(120),
        duration: 700,
        ease: 'outCubic',
      })
    }
  }, [])

  return (
    <section ref={sectionRef} className="min-h-[60vh]">
      <h2 className="animate-in opacity-0 font-display text-5xl italic text-charcoal mb-10">
        about
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="animate-in opacity-0 md:col-span-2 space-y-6">
          <p className="font-body text-lg text-charcoal/80 leading-relaxed">
            Hi! I'm Lei (/leɪ/) Wu, a 4th year computer science student at Carleton University.
            I have co-op experience in data analysis, project coordination, and software development —
            I'm looking to expand my knowledge in the world of product management and building products.
          </p>
          <p className="font-body text-lg text-charcoal/80 leading-relaxed">
            In my spare time, I love to travel and explore new foods. I enjoy living healthy
            as a gym rat and have a burning passion for being great at what I do — showcased
            by hitting leaderboard ranks in 3 Riot Games titles.
          </p>
        </div>

        <div className="animate-in opacity-0 space-y-4">
          <div className="bg-cream-dark rounded-2xl p-6 space-y-3">
            <h3 className="font-display text-xl italic text-gold-dark">quick stats</h3>
            <div className="space-y-2 font-body text-sm text-charcoal/70">
              <div className="flex justify-between">
                <span>bench</span>
                <span className="font-mono text-charcoal">230 lbs</span>
              </div>
              <div className="flex justify-between">
                <span>squat</span>
                <span className="font-mono text-charcoal">275 lbs</span>
              </div>
              <div className="flex justify-between">
                <span>deadlift</span>
                <span className="font-mono text-charcoal">405 lbs</span>
              </div>
              <div className="flex justify-between border-t border-charcoal/10 pt-2 mt-2">
                <span>bodyweight</span>
                <span className="font-mono text-charcoal">175 lbs</span>
              </div>
            </div>
          </div>

          <div className="bg-cream-dark rounded-2xl p-6">
            <h3 className="font-display text-xl italic text-gold-dark mb-3">contact</h3>
            <div className="space-y-2 font-body text-sm">
              <a href="mailto:lw2002@hotmail.ca" className="block text-charcoal/70 hover:text-gold-dark transition-colors">
                lw2002@hotmail.ca
              </a>
              <a href="https://www.linkedin.com/in/leiwuhoo/" target="_blank" rel="noopener noreferrer" className="block text-charcoal/70 hover:text-gold-dark transition-colors">
                linkedin/leiwuhoo
              </a>
              <a href="https://x.com/ujustgotleid" target="_blank" rel="noopener noreferrer" className="block text-charcoal/70 hover:text-gold-dark transition-colors">
                @ujustgotleid
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
