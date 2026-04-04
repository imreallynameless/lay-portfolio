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
            const key = d.date.slice(0, 7)
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
          delay: stagger(30),
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
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-display text-base italic text-charcoal">github</h3>
        <span className="font-mono text-[10px] text-warm-gray">{total.toLocaleString()} this year</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-6 gap-[2px]">
        {months.slice(0, 12).map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(selected === m.key ? null : m.key)}
            className={`gh-cell opacity-0 h-10 flex flex-col items-center justify-center
                       cursor-pointer transition-all duration-150 text-center
                       ${colorToLevel(m.count)}
                       ${selected === m.key ? 'ring-1 ring-charcoal' : 'hover:brightness-95'}`}
          >
            <span className="font-mono text-[7px] text-charcoal/40 leading-none">{m.month} {m.year.slice(2)}</span>
            <span className="font-mono text-sm font-bold text-charcoal leading-none mt-0.5">{m.count}</span>
          </button>
        ))}
      </div>

      {selected && (() => {
        const m = months.find((x) => x.key === selected)
        return m ? (
          <p className="font-mono text-[10px] text-warm-gray mt-1">{m.month} {m.year} — {m.count} contributions</p>
        ) : null
      })()}
    </div>
  )
}

export default GitHubHeatmap
