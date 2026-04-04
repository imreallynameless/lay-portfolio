import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type ContributionDay = {
  date: string
  count: number
}

type Week = ContributionDay[]

const GITHUB_USERNAME = 'imreallynameless'

const colorToLevel = (count: number): string => {
  if (count === 0) return 'bg-charcoal/8'
  if (count <= 2) return 'bg-gold-light'
  if (count <= 5) return 'bg-gold'
  if (count <= 8) return 'bg-gold-dark'
  return 'bg-red'
}

const GitHubHeatmap = () => {
  const [weeks, setWeeks] = useState<Week[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<ContributionDay | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        )
        const data = await res.json()
        if (data.contributions) {
          const contribs: ContributionDay[] = data.contributions
          const weekArr: Week[] = []
          let current: ContributionDay[] = []
          contribs.forEach((d, i) => {
            current.push(d)
            if (current.length === 7 || i === contribs.length - 1) {
              weekArr.push(current)
              current = []
            }
          })
          setWeeks(weekArr)
          setTotal(contribs.reduce((s, d) => s + d.count, 0))
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
      const cells = gridRef.current.querySelectorAll('.c')
      if (cells.length) {
        animate(cells, {
          opacity: [0, 1],
          delay: stagger(1),
          duration: 200,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">loading github...</p>
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-base italic text-charcoal">github</h3>
        <span className="font-mono text-[10px] text-warm-gray">{total.toLocaleString()} this year</span>
      </div>

      <div ref={gridRef} className="overflow-hidden">
        <div className="flex gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`c w-[9px] h-[9px] opacity-0 cursor-pointer
                             ${colorToLevel(day.count)}
                             ${hovered?.date === day.date ? 'ring-1 ring-charcoal' : ''}`}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hover detail or legend */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono text-[10px] text-warm-gray h-3">
          {hovered ? `${hovered.date} — ${hovered.count} contributions` : ''}
        </span>
        <div className="flex items-center gap-1 text-[9px] font-body text-warm-gray">
          <span>less</span>
          <div className="w-[9px] h-[9px] bg-charcoal/8" />
          <div className="w-[9px] h-[9px] bg-gold-light" />
          <div className="w-[9px] h-[9px] bg-gold" />
          <div className="w-[9px] h-[9px] bg-gold-dark" />
          <div className="w-[9px] h-[9px] bg-red" />
          <span>more</span>
        </div>
      </div>
    </div>
  )
}

export default GitHubHeatmap
