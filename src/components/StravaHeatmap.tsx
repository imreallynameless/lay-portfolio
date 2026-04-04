import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type Activity = {
  id: number
  name: string
  distance: number
  moving_time: number
  type: string
}

type MonthlySummary = {
  month: string
  monthName: string
  year: string
  activityCount: number
  totalDistance: number
  totalTime: number
}

const STRAVA_BASE = 'https://strava-worker.leiwuhoo.workers.dev'

const activityColor = (count: number): string => {
  if (count === 0) return 'bg-charcoal/5'
  if (count <= 2) return 'bg-gold-light'
  if (count <= 5) return 'bg-gold'
  if (count <= 10) return 'bg-gold-dark'
  return 'bg-red'
}

const fmtDist = (m: number) => `${(m / 1000).toFixed(0)}km`
const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600)
  const min = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h${min}m` : `${min}m`
}

const StravaHeatmap = () => {
  const [months, setMonths] = useState<MonthlySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingActs, setLoadingActs] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await fetch(`${STRAVA_BASE}/activities-by-month`)
        const data = await res.json()
        if (data.months) setMonths(data.months)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMonthly()
  }, [])

  useEffect(() => {
    if (!loading && gridRef.current) {
      const cells = gridRef.current.querySelectorAll('.strava-cell')
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

  const handleClick = async (month: MonthlySummary) => {
    if (selected === month.month) {
      setSelected(null)
      setActivities([])
      return
    }
    setSelected(month.month)
    setLoadingActs(true)
    try {
      const res = await fetch(`${STRAVA_BASE}/activities-by-month?month=${month.month}`)
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingActs(false)
    }
  }

  const currentYear = new Date().getFullYear().toString()
  const thisYearMonths = months.filter((m) => m.year === currentYear)
  const totalActs = thisYearMonths.reduce((s, m) => s + m.activityCount, 0)
  const totalDist = thisYearMonths.reduce((s, m) => s + m.totalDistance, 0)

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">loading strava...</p>
  }

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="font-display text-base italic text-charcoal">strava</h3>
        <span className="font-mono text-[10px] text-warm-gray">{totalActs} activities · {fmtDist(totalDist)}</span>
      </div>

      <div className="relative">
        <div ref={gridRef} className="grid grid-cols-6 gap-[2px]">
          {thisYearMonths.map((m) => (
            <button
              key={m.month}
              onClick={() => handleClick(m)}
              className={`strava-cell opacity-0 h-10 flex flex-col items-center justify-center
                         cursor-pointer transition-all duration-150 text-center
                         ${activityColor(m.activityCount)}
                         ${selected === m.month ? 'ring-1 ring-charcoal' : 'hover:brightness-95'}`}
            >
              <span className="font-mono text-[7px] text-charcoal/40 leading-none">{m.monthName.slice(0, 3)} {m.year.slice(2)}</span>
              <span className="font-mono text-sm font-bold text-charcoal leading-none mt-0.5">{m.activityCount}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-cream border border-charcoal/10 p-3 z-10 shadow-sm">
            {loadingActs ? (
              <p className="font-mono text-[10px] text-warm-gray animate-pulse">loading...</p>
            ) : activities.length > 0 ? (
              <div className="space-y-0.5">
                {activities.slice(0, 4).map((a) => (
                  <a
                    key={a.id}
                    href={`https://www.strava.com/activities/${a.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between font-mono text-[10px] text-warm-gray hover:text-charcoal transition-colors"
                  >
                    <span className="truncate mr-2">{a.name}</span>
                    <span className="flex-shrink-0">{fmtDist(a.distance)} · {fmtTime(a.moving_time)}</span>
                  </a>
                ))}
                {activities.length > 4 && (
                  <p className="font-mono text-[9px] text-warm-gray/50">+{activities.length - 4} more</p>
                )}
              </div>
            ) : (
              <p className="font-mono text-[10px] text-warm-gray">no activities</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StravaHeatmap
