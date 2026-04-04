import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type Activity = {
  id: number
  name: string
  start_date: string
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

const formatDist = (m: number) => `${(m / 1000).toFixed(0)}km`
const formatTime = (s: number) => {
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
          delay: stagger(20),
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

  const totalActs = months.reduce((s, m) => s + m.activityCount, 0)
  const totalDist = months.reduce((s, m) => s + m.totalDistance, 0)
  const totalTime = months.reduce((s, m) => s + m.totalTime, 0)

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">loading strava...</p>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg italic text-charcoal">strava</h3>
        <div className="flex gap-3 font-mono text-[10px] text-warm-gray">
          <span>{totalActs} activities</span>
          <span>{formatDist(totalDist)}</span>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-12 gap-[3px] content-start">
        {months.slice(0, 12).map((m) => (
          <button
            key={m.month}
            onClick={() => handleClick(m)}
            className={`strava-cell opacity-0 aspect-square flex flex-col items-center justify-center
                       cursor-pointer transition-all duration-150
                       ${activityColor(m.activityCount)}
                       ${selected === m.month ? 'ring-2 ring-charcoal ring-offset-1 ring-offset-cream' : ''}`}
            title={`${m.monthName} ${m.year}: ${m.activityCount} activities`}
          >
            <span className="font-mono text-[7px] text-charcoal/40 leading-none">{m.year}</span>
            <span className="font-mono text-[8px] text-charcoal/50 leading-none">{m.monthName.slice(0, 3)}</span>
            <span className="font-mono text-xs font-bold text-charcoal leading-none mt-0.5">{m.activityCount}</span>
          </button>
        ))}
      </div>

      {/* Selected month activities */}
      {selected && (
        <div className="mt-2 max-h-24 overflow-auto">
          {loadingActs ? (
            <p className="font-body text-[10px] text-warm-gray animate-pulse">loading...</p>
          ) : activities.length > 0 ? (
            <div className="space-y-0.5">
              {activities.slice(0, 5).map((a) => (
                <a
                  key={a.id}
                  href={`https://www.strava.com/activities/${a.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between font-mono text-[10px] text-warm-gray
                             hover:text-charcoal transition-colors py-0.5"
                >
                  <span className="truncate mr-2">{a.name}</span>
                  <span className="flex-shrink-0">{formatDist(a.distance)} · {formatTime(a.moving_time)}</span>
                </a>
              ))}
              {activities.length > 5 && (
                <p className="font-mono text-[9px] text-warm-gray/50">+{activities.length - 5} more</p>
              )}
            </div>
          ) : (
            <p className="font-body text-[10px] text-warm-gray">no activities</p>
          )}
        </div>
      )}
    </div>
  )
}

export default StravaHeatmap
