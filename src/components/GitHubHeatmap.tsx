import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type ContributionDay = {
  date: string
  contributionCount: number
  color: string
}

type ContributionWeek = {
  contributionDays: ContributionDay[]
}

const GITHUB_USERNAME = 'imreallynameless'

const colorToLevel = (count: number): string => {
  if (count === 0) return 'bg-charcoal/5'
  if (count <= 2) return 'bg-gold-light'
  if (count <= 5) return 'bg-gold'
  if (count <= 8) return 'bg-gold-dark'
  return 'bg-red'
}

const GitHubHeatmap = () => {
  const [weeks, setWeeks] = useState<ContributionWeek[]>([])
  const [totalContributions, setTotalContributions] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        // Use GitHub's GraphQL via a simple proxy, or fall back to scraping
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        )
        const data = await response.json()

        if (data.contributions) {
          // Transform flat contribution data into weeks
          const contributions: { date: string; count: number }[] = data.contributions
          const weekMap: ContributionWeek[] = []
          let currentWeek: ContributionDay[] = []

          contributions.forEach((day: { date: string; count: number }, i: number) => {
            currentWeek.push({
              date: day.date,
              contributionCount: day.count,
              color: '',
            })

            if (currentWeek.length === 7 || i === contributions.length - 1) {
              weekMap.push({ contributionDays: currentWeek })
              currentWeek = []
            }
          })

          setWeeks(weekMap)
          setTotalContributions(
            contributions.reduce((sum: number, d: { count: number }) => sum + d.count, 0)
          )
        }
      } catch (err) {
        setError('Could not load GitHub contributions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  useEffect(() => {
    if (!loading && gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.contrib-cell')
      if (cells.length) {
        animate(cells, {
          opacity: [0, 1],
          scale: [0.5, 1],
          delay: stagger(2, { from: 'first' }),
          duration: 400,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-body text-warm-gray animate-pulse">loading contributions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-body text-warm-gray">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-display text-2xl italic text-charcoal">
          github contributions
        </h3>
        <span className="font-mono text-sm text-warm-gray">
          {totalContributions.toLocaleString()} this year
        </span>
      </div>

      <div ref={gridRef} className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-fit">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.contributionDays.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`contrib-cell w-[11px] h-[11px] rounded-[2px] opacity-0 ${colorToLevel(day.contributionCount)}`}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs font-body text-warm-gray">
        <span>less</span>
        <div className="w-[11px] h-[11px] rounded-[2px] bg-charcoal/5" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold-light" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold-dark" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-red" />
        <span>more</span>
      </div>
    </div>
  )
}

export default GitHubHeatmap
