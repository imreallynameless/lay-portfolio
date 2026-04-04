import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

const GITHUB_USERNAME = 'imreallynameless'

type MonthData = {
  key: string
  month: string
  year: string
  count: number
}

const colorToLevel = (count: number): string => {
  if (count === 0) return 'bg-charcoal/5'
  if (count <= 10) return 'bg-gold-light'
  if (count <= 30) return 'bg-gold'
  if (count <= 60) return 'bg-gold-dark'
  return 'bg-red'
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GitHubHeatmap = () => {
  const [months, setMonths] = useState<MonthData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        )
        const data = await res.json()

        if (data.contributions) {
          const contribs: { date: string; count: number }[] = data.contributions
          const monthMap = new Map<string, number>()

          contribs.forEach((d) => {
            const key = d.date.slice(0, 7) // YYYY-MM
            monthMap.set(key, (monthMap.get(key) || 0) + d.count)
          })

          const monthArr: MonthData[] = Array.from(monthMap.entries())
            .map(([key, count]) => {
              const [year, monthNum] = key.split('-')
              return { key, month: MONTH_NAMES[parseInt(monthNum) - 1], year, count }
            })
            .sort((a, b) => b.key.localeCompare(a.key))

          setMonths(monthArr)
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
      const cells = gridRef.current.querySelectorAll('.gh-cell')
      if (cells.length) {
        animate(cells, {
          opacity: [0, 1],
          scale: [0.8, 1],
          delay: stagger(20),
          duration: 300,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">loading github...</p>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg italic text-charcoal">github</h3>
        <span className="font-mono text-[10px] text-warm-gray">{total.toLocaleString()} this year</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-12 gap-[3px] flex-1 content-start">
        {months.slice(0, 12).map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(selected === m.key ? null : m.key)}
            className={`gh-cell opacity-0 aspect-square flex flex-col items-center justify-center
                       cursor-pointer transition-all duration-150
                       ${colorToLevel(m.count)}
                       ${selected === m.key ? 'ring-2 ring-charcoal ring-offset-1 ring-offset-cream' : ''}`}
            title={`${m.month} ${m.year}: ${m.count} contributions`}
          >
            <span className="font-mono text-[7px] text-charcoal/40 leading-none">{m.year}</span>
            <span className="font-mono text-[8px] text-charcoal/50 leading-none">{m.month}</span>
            <span className="font-mono text-xs font-bold text-charcoal leading-none mt-0.5">{m.count}</span>
          </button>
        ))}
      </div>

      {/* Selected detail */}
      {selected && (() => {
        const m = months.find((m) => m.key === selected)
        if (!m) return null
        return (
          <div className="mt-2 font-mono text-[10px] text-warm-gray">
            {m.month} {m.year} — {m.count} contributions
          </div>
        )
      })()}
    </div>
  )
}

export default GitHubHeatmap
