import { useEffect, useRef } from 'react'
import { createTimeline, animate, stagger } from 'animejs'

const Home = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = createTimeline({ defaults: { ease: 'outCubic' } })

    tl.add(titleRef.current!, {
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 800,
    })
    .add(taglineRef.current!, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
    }, '-=400')

    if (linksRef.current?.children) {
      animate(linksRef.current.children, {
        opacity: [0, 1],
        translateY: [15, 0],
        delay: stagger(100, { start: 600 }),
        duration: 500,
        ease: 'outCubic',
      })
    }
  }, [])

  return (
    <section className="min-h-[70vh] flex flex-col justify-center">
      <div className="space-y-8">
        <h1
          ref={titleRef}
          className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] text-charcoal opacity-0"
        >
          lei <span className="italic text-gold-dark">(lay)</span> wu
        </h1>

        <p
          ref={taglineRef}
          className="font-body text-xl text-warm-gray max-w-lg leading-relaxed opacity-0"
        >
          cs student · builder · gym rat · gamer
          <br />
          <span className="text-gold-dark font-medium">betcha can't visit just once</span>
        </p>

        <div ref={linksRef} className="flex gap-4 flex-wrap">
          {[
            { label: 'github', url: 'https://github.com/imreallynameless' },
            { label: 'linkedin', url: 'https://www.linkedin.com/in/leiwuhoo/' },
            { label: 'twitter', url: 'https://x.com/ujustgotleid' },
            { label: 'email', url: 'mailto:lw2002@hotmail.ca' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-charcoal/15 text-sm font-body text-charcoal
                         hover:bg-gold hover:border-gold hover:shadow-md hover:shadow-gold/20
                         transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Decorative wavy divider */}
      <svg
        className="w-full mt-20 text-gold/30"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </section>
  )
}

export default Home
