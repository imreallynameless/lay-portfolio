import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'

type Project = {
  title: string
  description: string
  url?: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'Playground',
    description:
      'Full-stack playground featuring Spotify integration, TFT match history, Strava tracking, book bar, and a cooking recipe collection.',
    url: 'https://laywu.ca/playground',
    tags: ['react', 'cloudflare workers', 'apis'],
  },
  {
    title: 'Investology',
    description:
      'Algorithm that offers investment portfolio recommendations based on MBTI. Built with Vite, React, and FastAPI.',
    url: 'https://devpost.com/software/tarot-investing',
    tags: ['react', 'fastapi', 'vite'],
  },
  {
    title: 'Clear Vision',
    description:
      'AI model using OpenCV & TensorFlow for real-time waste sorting. Winner of 100+ teams at Hack the Hill.',
    url: 'https://devpost.com/software/clean-vision',
    tags: ['python', 'opencv', 'tensorflow', 'hackathon winner'],
  },
  {
    title: 'Starry Stocks',
    description:
      'Processed 200k+ data points to visualize stock transactions with p5.js via WebSockets. Identified outliers using statistical models.',
    url: 'https://devpost.com/software/solar-system-stocks',
    tags: ['p5.js', 'websockets', 'data viz'],
  },
  {
    title: 'Search Engine',
    description:
      'Web crawler in Python with PageRank, cosine similarity, and TF-IDF for search ranking. Document database for optimized runtime.',
    tags: ['python', 'pagerank', 'nlp'],
  },
]

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.project-card')
    if (cards) {
      animate(cards, {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100, { start: 200 }),
        duration: 600,
        ease: 'outCubic',
      })
    }
  }, [])

  return (
    <section ref={sectionRef}>
      <h2 className="font-display text-5xl italic text-charcoal mb-10">
        projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <div
            key={project.title}
            className="project-card opacity-0 group bg-cream-dark rounded-2xl p-6
                       hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10
                       transition-all duration-300 cursor-default"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-2xl text-charcoal group-hover:text-gold-dark transition-colors">
                {project.title}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-gray hover:text-gold-dark transition-colors text-sm font-mono"
                >
                  ↗
                </a>
              )}
            </div>

            <p className="font-body text-sm text-charcoal/65 leading-relaxed mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-xs font-mono rounded-full
                             bg-charcoal/5 text-warm-gray"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects
