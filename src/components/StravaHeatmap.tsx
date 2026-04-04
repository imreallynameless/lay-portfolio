import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

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

const formatDistance = (m: number) => `${(m / 1000).toFixed(0)}km`
const formatTime = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h${m}m` : `${m}m`
}

const StravaHeatmap = () => {
  const [months, setMonths] = useState<MonthlySummary[]>([])
  const [loading, setLoading] = useState(true)
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
          delay: stagger(20, { from: 'first' }),
          duration: 300,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  const totalActivities = months.reduce((s, m) => s + m.activityCount, 0)
  const totalDistance = months.reduce((s, m) => s + m.totalDistance, 0)
  const totalTime = months.reduce((s, m) => s + m.totalTime, 0)

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
        <h3 className="font-display text-lg italic text-charcoal">strava</h3>
        <div className="flex gap-3 font-mono text-[10px] text-warm-gray">
          <span>{totalActivities} activities</span>
          <span>{formatDistance(totalDistance)}</span>
          <span>{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* Contribution-board style grid */}
      <div ref={gridRef} className="flex-1 flex items-center">
        <div className="grid grid-cols-12 gap-[3px] w-full">
          {months.slice(0, 24).map((month) => (
            <div
              key={month.month}
              className={`strava-cell opacity-0 aspect-square flex flex-col items-center justify-center
                         ${activityColor(month.activityCount)}`}
              title={`${month.monthName} ${month.year}: ${month.activityCount} activities`}
            >
              <span className="font-mono text-[8px] text-charcoal/50 leading-none">
                {month.monthName.slice(0, 3)}
              </span>
              <span className="font-mono text-xs font-bold text-charcoal leading-none mt-0.5">
                {month.activityCount}
              </span>
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

export default StravaHeatmap
