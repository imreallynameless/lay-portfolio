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
  album: {
    name: string
    images: { url: string }[]
  }
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
  topTracks: {
    monthly: Track[]
    sixMonth: Track[]
    allTime: Track[]
  }
  topArtists: {
    monthly: Artist[]
    sixMonth: Artist[]
    allTime: Artist[]
  }
}

const STATS_ENDPOINT = 'https://spotify.leiwuhoo.workers.dev/get-spotify-stats'

const timeRanges = [
  { id: 'monthly', label: '4 weeks' },
  { id: 'sixMonth', label: '6 months' },
  { id: 'allTime', label: 'all time' },
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
      animate(ref.current.querySelectorAll('.sp-animate'), {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(60),
        duration: 400,
        ease: 'outCubic',
      })
    }
  }, [loading])

  // Re-animate list when range changes
  useEffect(() => {
    if (listRef.current) {
      animate(listRef.current.querySelectorAll('.track-row'), {
        opacity: [0, 1],
        translateX: [8, 0],
        delay: stagger(40),
        duration: 300,
        ease: 'outCubic',
      })
    }
  }, [range, loading])

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">loading spotify...</p>
  }

  if (!stats) return null

  const np = stats.nowPlaying
  const tracks = stats.topTracks[range]
  const artists = stats.topArtists[range]

  return (
    <div ref={ref}>
      {/* Now playing */}
      {np.item && (
        <a
          href={np.item.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="sp-animate opacity-0 flex items-center gap-3 group mb-4"
        >
          <div className="relative flex-shrink-0">
            <img
              src={np.item.album.images[0]?.url}
              alt={np.item.album.name}
              className="w-10 h-10 object-cover group-hover:opacity-80 transition-opacity"
            />
            {np.is_playing && (
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold animate-pulse" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-display text-base italic text-charcoal flex-shrink-0">
                {np.is_playing ? 'playing' : 'last played'}
              </h3>
              <span className="font-body text-xs text-charcoal font-medium truncate group-hover:text-gold-dark transition-colors">
                {np.item.name}
              </span>
              <span className="font-body text-[10px] text-warm-gray truncate hidden sm:inline">
                {np.item.artists.map((a) => a.name).join(', ')}
              </span>
            </div>
            {np.is_playing && np.progress_ms && np.item.duration_ms && (
              <div className="mt-1 h-[2px] bg-charcoal/10 max-w-xs">
                <div className="h-full bg-gold" style={{ width: `${(np.progress_ms / np.item.duration_ms) * 100}%` }} />
              </div>
            )}
          </div>
        </a>
      )}

      {/* Header + range toggle */}
      <div className="sp-animate opacity-0 flex items-baseline justify-between mb-3">
        <h3 className="font-display text-base italic text-charcoal">top tracks</h3>
        <div className="flex gap-1">
          {timeRanges.map((t) => (
            <button
              key={t.id}
              onClick={() => setRange(t.id)}
              className={`px-2 py-0.5 text-[10px] font-mono cursor-pointer transition-all duration-150
                         ${range === t.id
                           ? 'bg-charcoal text-cream'
                           : 'text-warm-gray hover:text-charcoal'
                         }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top tracks */}
      <div ref={listRef} className="space-y-1 mb-4">
        {tracks.map((track, i) => (
          <a
            key={`${range}-${track.name}-${i}`}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="track-row opacity-0 flex items-center gap-2.5 py-1 group hover:bg-gold/5 transition-colors -mx-1 px-1"
          >
            <span className="font-mono text-[10px] text-warm-gray w-3 text-right flex-shrink-0">{i + 1}</span>
            <img
              src={track.album.images[track.album.images.length - 1]?.url}
              alt={track.album.name}
              className="w-7 h-7 object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs text-charcoal truncate group-hover:text-gold-dark transition-colors">
                {track.name}
              </p>
              <p className="font-body text-[10px] text-warm-gray truncate">
                {track.artists.map((a) => a.name).join(', ')}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Top artists */}
      <div className="sp-animate opacity-0">
        <h3 className="font-display text-base italic text-charcoal mb-2">top artists</h3>
        <div className="flex gap-1">
          {artists.map((artist, i) => (
            <a
              key={`${range}-${artist.name}-${i}`}
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 group text-center"
            >
              {artist.images?.[0] && (
                <img
                  src={artist.images[artist.images.length > 1 ? 1 : 0]?.url}
                  alt={artist.name}
                  className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
                />
              )}
              <p className="font-body text-[10px] text-warm-gray mt-1 truncate group-hover:text-charcoal transition-colors">
                {artist.name}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Recently played */}
      <div className="sp-animate opacity-0 mt-4">
        <h3 className="font-display text-base italic text-charcoal mb-2">recently played</h3>
        <div className="space-y-0.5">
          {stats.recentlyPlayed.slice(0, 5).map((item, i) => (
            <a
              key={`recent-${i}`}
              href={item.track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between font-mono text-[10px] text-warm-gray hover:text-charcoal transition-colors py-0.5"
            >
              <span className="truncate mr-2">{item.track.name} — {item.track.artists[0]?.name}</span>
              <span className="flex-shrink-0 text-warm-gray/50">
                {new Date(item.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpotifyNow
