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
    description: 'Full-stack playground with Spotify, TFT match history, Strava tracking, book bar, and recipes.',
    url: 'https://laywu.ca/playground',
    tags: ['react', 'workers', 'apis'],
  },
  {
    title: 'Investology',
    description: 'MBTI-based investment portfolio recommendations. Vite + React + FastAPI.',
    url: 'https://devpost.com/software/tarot-investing',
    tags: ['react', 'fastapi'],
  },
  {
    title: 'Clear Vision',
    description: 'Real-time AI waste sorting with OpenCV & TensorFlow. Hack the Hill winner (100+ teams).',
    url: 'https://devpost.com/software/clean-vision',
    tags: ['python', 'opencv', 'winner'],
  },
  {
    title: 'Starry Stocks',
    description: '200k+ data points visualized with p5.js via WebSockets. Statistical outlier detection.',
    url: 'https://devpost.com/software/solar-system-stocks',
    tags: ['p5.js', 'data viz'],
  },
  {
    title: 'Search Engine',
    description: 'Python web crawler with PageRank, cosine similarity, and TF-IDF ranking.',
    tags: ['python', 'nlp'],
  },
]

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.project-card')
    if (cards) {
      animate(cards, {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(80, { start: 100 }),
        duration: 500,
        ease: 'outCubic',
      })
    }
  }, [])

  return (
    <div ref={sectionRef} className="h-full flex flex-col">
      <h2 className="font-display text-3xl italic text-charcoal mb-6">projects</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 flex-1 content-start">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.url}
            target={project.url ? '_blank' : undefined}
            rel={project.url ? 'noopener noreferrer' : undefined}
            className={`project-card opacity-0 group bg-cream-dark p-4
                       hover:bg-gold/10 hover:shadow-md hover:shadow-gold/10
                       transition-all duration-300
                       ${project.url ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display text-lg text-charcoal group-hover:text-gold-dark transition-colors">
                {project.title}
              </h3>
              {project.url && (
                <span className="text-warm-gray group-hover:text-gold-dark transition-colors text-xs font-mono mt-1">↗</span>
              )}
            </div>

            <p className="font-body text-xs text-charcoal/55 leading-relaxed mb-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-mono bg-charcoal/5 text-warm-gray"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Projects
