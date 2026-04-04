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
  if (count === 1) return 'bg-gold-light'
  if (count <= 3) return 'bg-gold'
  if (count <= 5) return 'bg-gold-dark'
  return 'bg-red'
}

const formatDistance = (m: number) => `${(m / 1000).toFixed(1)} km`
const formatTime = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const StravaHeatmap = () => {
  const [months, setMonths] = useState<MonthlySummary[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await fetch(`${STRAVA_BASE}/activities-by-month`)
        const data = await res.json()
        if (data.months) {
          setMonths(data.months)
        }
      } catch (err) {
        console.error('Error fetching Strava data:', err)
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
          scale: [0.5, 1],
          delay: stagger(30, { from: 'first' }),
          duration: 400,
          ease: 'outCubic',
        })
      }
    }
  }, [loading])

  const handleMonthClick = async (month: MonthlySummary) => {
    if (selectedMonth === month.month) {
      setSelectedMonth(null)
      setActivities([])
      return
    }
    setSelectedMonth(month.month)
    setLoadingActivities(true)
    try {
      const res = await fetch(`${STRAVA_BASE}/activities-by-month?month=${month.month}`)
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingActivities(false)
    }
  }

  // Calculate totals
  const totalActivities = months.reduce((sum, m) => sum + m.activityCount, 0)
  const totalDistance = months.reduce((sum, m) => sum + m.totalDistance, 0)
  const totalTime = months.reduce((sum, m) => sum + m.totalTime, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-body text-warm-gray animate-pulse">loading strava data...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h3 className="font-display text-2xl italic text-charcoal">
          strava activity
        </h3>
        <span className="font-mono text-sm text-warm-gray">
          {totalActivities} activities · {formatDistance(totalDistance)}
        </span>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-cream/80 rounded-xl p-4 text-center">
          <div className="font-mono text-xl text-gold-dark font-bold">{totalActivities}</div>
          <div className="font-body text-xs text-warm-gray uppercase tracking-wide">activities</div>
        </div>
        <div className="bg-cream/80 rounded-xl p-4 text-center">
          <div className="font-mono text-xl text-gold-dark font-bold">{formatDistance(totalDistance)}</div>
          <div className="font-body text-xs text-warm-gray uppercase tracking-wide">distance</div>
        </div>
        <div className="bg-cream/80 rounded-xl p-4 text-center">
          <div className="font-mono text-xl text-gold-dark font-bold">{formatTime(totalTime)}</div>
          <div className="font-body text-xs text-warm-gray uppercase tracking-wide">time</div>
        </div>
      </div>

      {/* Month heatmap grid - contribution board style */}
      <div ref={gridRef} className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
        {months.map((month) => (
          <button
            key={month.month}
            onClick={() => handleMonthClick(month)}
            className={`strava-cell opacity-0 rounded-lg p-3 text-center cursor-pointer
                        transition-all duration-200 border-2
                        ${selectedMonth === month.month
                          ? 'border-gold-dark shadow-md'
                          : 'border-transparent hover:border-gold/50'
                        }
                        ${activityColor(month.activityCount)}`}
            title={`${month.monthName} ${month.year}: ${month.activityCount} activities`}
          >
            <div className="font-mono text-[10px] text-charcoal/60">
              {month.monthName.slice(0, 3)}
            </div>
            <div className="font-mono text-sm font-bold text-charcoal">
              {month.activityCount}
            </div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mb-6 text-xs font-body text-warm-gray">
        <span>less</span>
        <div className="w-[11px] h-[11px] rounded-[2px] bg-charcoal/5" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold-light" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-gold-dark" />
        <div className="w-[11px] h-[11px] rounded-[2px] bg-red" />
        <span>more</span>
      </div>

      {/* Expanded month activities */}
      {selectedMonth && (
        <div className="bg-cream/80 rounded-xl p-4">
          <h4 className="font-display text-lg italic text-charcoal mb-4">
            {months.find((m) => m.month === selectedMonth)?.monthName.toLowerCase()}{' '}
            {months.find((m) => m.month === selectedMonth)?.year} activities
          </h4>
          {loadingActivities ? (
            <p className="font-body text-warm-gray text-sm animate-pulse">loading...</p>
          ) : activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((a) => (
                <a
                  key={a.id}
                  href={`https://www.strava.com/activities/${a.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg
                             hover:bg-gold/10 transition-colors"
                >
                  <div>
                    <span className="font-body text-sm text-charcoal">{a.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-mono rounded-full bg-charcoal/10 text-warm-gray">
                      {a.type}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-warm-gray flex gap-3">
                    <span>{formatDistance(a.distance)}</span>
                    <span>{formatTime(a.moving_time)}</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="font-body text-warm-gray text-sm">no activities found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default StravaHeatmap
