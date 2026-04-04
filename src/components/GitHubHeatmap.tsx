import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type ContributionDay = {
  date: string
  contributionCount: number
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
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        )
        const data = await response.json()

        if (data.contributions) {
          const contributions: { date: string; count: number }[] = data.contributions
          const weekMap: ContributionWeek[] = []
          let currentWeek: ContributionDay[] = []

          contributions.forEach((day: { date: string; count: number }, i: number) => {
            currentWeek.push({ date: day.date, contributionCount: day.count })
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
          delay: stagger(1, { from: 'first' }),
          duration: 300,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-body text-xs text-warm-gray animate-pulse">loading...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg italic text-charcoal">github</h3>
        <span className="font-mono text-[10px] text-warm-gray">
          {totalContributions.toLocaleString()} this year
        </span>
      </div>

      <div ref={gridRef} className="flex-1 overflow-hidden flex items-center">
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.contributionDays.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`contrib-cell w-[8px] h-[8px] opacity-0 ${colorToLevel(day.contributionCount)}`}
                  title={`${day.date}: ${day.contributionCount}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 mt-2 text-[9px] font-body text-warm-gray">
        <span>less</span>
        <div className="w-[8px] h-[8px] bg-charcoal/5" />
        <div className="w-[8px] h-[8px] bg-gold-light" />
        <div className="w-[8px] h-[8px] bg-gold" />
        <div className="w-[8px] h-[8px] bg-gold-dark" />
        <div className="w-[8px] h-[8px] bg-red" />
        <span>more</span>
      </div>
    </div>
  )
}

export default GitHubHeatmap
