import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

type SpotifyTrack = {
  is_playing: boolean
  item: {
    name: string
    artists: { name: string }[]
    album: {
      name: string
      images: { url: string }[]
    }
    external_urls: { spotify: string }
    duration_ms: number
  }
  progress_ms: number
}

const SPOTIFY_ENDPOINT = 'https://spotify.leiwuhoo.workers.dev/get-now-playing'

const SpotifyNow = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(SPOTIFY_ENDPOINT)
        if (res.status === 204 || res.status === 404) {
          setTrack(null)
          setLoading(false)
          return
        }
        const data = await res.json()
        if (data?.item) setTrack(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading && cardRef.current) {
      animate(cardRef.current, { opacity: [0, 1], duration: 500, ease: 'outCubic' })
    }
  }, [loading])

  if (loading) return null

  if (!track?.item) {
    return (
      <div className="flex items-center gap-2">
        <h3 className="font-display text-base italic text-charcoal">spotify</h3>
        <span className="font-body text-xs text-warm-gray">· nothing playing</span>
      </div>
    )
  }

  return (
    <div ref={cardRef} className="opacity-0">
      <a
        href={track.item.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 group"
      >
        {/* Album art */}
        <div className="relative flex-shrink-0">
          <img
            src={track.item.album.images[0]?.url}
            alt={track.item.album.name}
            className="w-10 h-10 object-cover group-hover:opacity-80 transition-opacity"
          />
          {track.is_playing && (
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gold animate-pulse" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-base italic text-charcoal">
              {track.is_playing ? 'playing' : 'last played'}
            </h3>
            <span className="font-body text-xs text-charcoal font-medium truncate group-hover:text-gold-dark transition-colors">
              {track.item.name}
            </span>
            <span className="font-body text-[10px] text-warm-gray truncate">
              {track.item.artists.map((a) => a.name).join(', ')}
            </span>
          </div>
          {track.is_playing && (
            <div className="mt-1 h-[2px] bg-charcoal/10 max-w-xs">
              <div className="h-full bg-gold" style={{ width: `${(track.progress_ms / track.item.duration_ms) * 100}%` }} />
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

export default SpotifyNow
