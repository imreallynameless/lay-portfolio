import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'

type Artist = {
  name: string
  external_urls: { spotify: string }
  images?: { url: string }[]
}

type Track = {
  name: string
  artists: { name: string }[]
  album: { name: string; images: { url: string }[] }
  external_urls: { spotify: string }
  duration_ms?: number
}

type NowPlaying = {
  is_playing: boolean
  item: Track | null
  progress_ms?: number
}

type SpotifyStats = {
  nowPlaying: NowPlaying
  recentlyPlayed: { track: Track; played_at: string }[]
  topTracks: { monthly: Track[]; sixMonth: Track[]; allTime: Track[] }
  topArtists: { monthly: Artist[]; sixMonth: Artist[]; allTime: Artist[] }
}

const STATS_ENDPOINT = 'https://spotify.leiwuhoo.workers.dev/get-spotify-stats'

const timeRanges = [
  { id: 'monthly', label: '4w' },
  { id: 'sixMonth', label: '6m' },
  { id: 'allTime', label: 'all' },
] as const

type TimeRange = (typeof timeRanges)[number]['id']

const SpotifyNow = () => {
  const [stats, setStats] = useState<SpotifyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState<TimeRange>('monthly')
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(STATS_ENDPOINT)
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (!loading && ref.current) {
      animate(ref.current.querySelectorAll('.sp'), {
        opacity: [0, 1], translateY: [8, 0], delay: stagger(40), duration: 300, ease: 'outCubic',
      })
    }
  }, [loading])

  useEffect(() => {
    if (listRef.current) {
      animate(listRef.current.querySelectorAll('.tr'), {
        opacity: [0, 1], translateX: [6, 0], delay: stagger(30), duration: 200, ease: 'outCubic',
      })
    }
  }, [range, loading])

  if (loading) return <p className="font-body text-xs text-warm-gray animate-pulse">loading spotify...</p>
  if (!stats) return null

  const np = stats.nowPlaying
  const tracks = stats.topTracks[range]
  const artists = stats.topArtists[range]

  return (
    <div ref={ref} className="h-full flex flex-col">
      {/* Now playing — compact inline */}
      {np.item && (
        <a href={np.item.external_urls.spotify} target="_blank" rel="noopener noreferrer"
          className="sp opacity-0 flex items-center gap-2 mb-3 group">
          <div className="relative flex-shrink-0">
            <img src={np.item.album.images[0]?.url} alt="" className="w-8 h-8 object-cover" />
            {np.is_playing && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold animate-pulse" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-sm italic text-charcoal flex-shrink-0">
                {np.is_playing ? '♫' : '♫'}
              </span>
              <span className="font-body text-[11px] text-charcoal truncate group-hover:text-gold-dark transition-colors">
                {np.item.name}
              </span>
              <span className="font-body text-[9px] text-warm-gray truncate">
                {np.item.artists.map((a) => a.name).join(', ')}
              </span>
            </div>
            {np.is_playing && np.progress_ms && np.item.duration_ms && (
              <div className="mt-0.5 h-[1px] bg-charcoal/10">
                <div className="h-full bg-gold" style={{ width: `${(np.progress_ms / np.item.duration_ms) * 100}%` }} />
              </div>
            )}
          </div>
        </a>
      )}

      {/* Top tracks header + toggle */}
      <div className="sp opacity-0 flex items-baseline justify-between mb-1.5">
        <h3 className="font-display text-sm italic text-charcoal">top tracks</h3>
        <div className="flex">
          {timeRanges.map((t) => (
            <button key={t.id} onClick={() => setRange(t.id)}
              className={`px-1.5 py-0.5 text-[9px] font-mono cursor-pointer transition-all duration-150
                ${range === t.id ? 'bg-charcoal text-cream' : 'text-warm-gray hover:text-charcoal'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top tracks list */}
      <div ref={listRef} className="mb-3">
        {tracks.map((track, i) => (
          <a key={`${range}-${i}`} href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer"
            className="tr opacity-0 flex items-center gap-1.5 py-[3px] group hover:bg-gold/5 transition-colors">
            <span className="font-mono text-[9px] text-warm-gray/50 w-2.5 text-right">{i + 1}</span>
            <img src={track.album.images[track.album.images.length - 1]?.url} alt="" className="w-5 h-5 object-cover flex-shrink-0" />
            <span className="font-body text-[11px] text-charcoal truncate group-hover:text-gold-dark transition-colors">{track.name}</span>
            <span className="font-body text-[9px] text-warm-gray truncate">— {track.artists[0]?.name}</span>
          </a>
        ))}
      </div>

      {/* Top artists — small row */}
      <div className="sp opacity-0 mb-3">
        <h3 className="font-display text-sm italic text-charcoal mb-1.5">top artists</h3>
        <div className="flex gap-[3px]">
          {artists.map((artist, i) => (
            <a key={`${range}-a-${i}`} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer"
              className="flex-1 min-w-0 group text-center">
              {artist.images?.[0] && (
                <img src={artist.images[artist.images.length > 1 ? 1 : 0]?.url} alt={artist.name}
                  className="w-full aspect-square object-cover group-hover:opacity-75 transition-opacity" />
              )}
              <p className="font-mono text-[8px] text-warm-gray mt-0.5 truncate">{artist.name}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recently played — compact */}
      <div className="sp opacity-0 mt-2">
        <h3 className="font-display text-sm italic text-charcoal mb-1">recent</h3>
        {stats.recentlyPlayed.slice(0, 3).map((item, i) => (
          <a key={`r-${i}`} href={item.track.external_urls.spotify} target="_blank" rel="noopener noreferrer"
            className="flex justify-between font-mono text-[9px] text-warm-gray hover:text-charcoal transition-colors py-[1px]">
            <span className="truncate mr-2">{item.track.name} — {item.track.artists[0]?.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default SpotifyNow
