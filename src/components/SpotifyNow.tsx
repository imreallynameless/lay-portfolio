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
    external_urls: {
      spotify: string
    }
    duration_ms: number
  }
  progress_ms: number
}

const SPOTIFY_ENDPOINT = 'https://spotify.leiwuhoo.workers.dev/get-now-playing'

const SpotifyNow = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        if (data?.item) {
          setTrack(data)
        }
      } catch (err) {
        setError('Could not reach Spotify')
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
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        ease: 'outCubic',
      })
    }
  }, [loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="font-body text-warm-gray animate-pulse">checking what's playing...</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="font-display text-2xl italic text-charcoal mb-6">
        currently listening
      </h3>

      <div ref={cardRef} className="opacity-0">
        {track?.item ? (
          <a
            href={track.item.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-6 bg-cream/80 rounded-2xl p-6
                       hover:bg-gold/10 transition-all duration-300 group"
          >
            {/* Album art */}
            <div className="relative flex-shrink-0">
              <img
                src={track.item.album.images[0]?.url}
                alt={track.item.album.name}
                className="w-28 h-28 rounded-xl shadow-lg group-hover:shadow-xl
                           group-hover:shadow-gold/20 transition-shadow"
              />
              {track.is_playing && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold rounded-full
                                shadow-md shadow-gold/50 animate-pulse" />
              )}
            </div>

            {/* Track info */}
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs text-warm-gray uppercase tracking-widest mb-1">
                {track.is_playing ? '♫ now playing' : '♫ last played'}
              </p>
              <h4 className="font-display text-xl text-charcoal truncate group-hover:text-gold-dark transition-colors">
                {track.item.name}
              </h4>
              <p className="font-body text-sm text-warm-gray truncate mt-1">
                {track.item.artists.map((a) => a.name).join(', ')}
              </p>
              <p className="font-body text-xs text-warm-gray/60 truncate mt-0.5">
                {track.item.album.name}
              </p>

              {/* Progress bar */}
              {track.is_playing && (
                <div className="mt-3 h-1 bg-charcoal/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-1000"
                    style={{
                      width: `${(track.progress_ms / track.item.duration_ms) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </a>
        ) : error ? (
          <div className="bg-cream/80 rounded-2xl p-8 text-center">
            <p className="font-body text-warm-gray">{error}</p>
          </div>
        ) : (
          <div className="bg-cream/80 rounded-2xl p-8 text-center">
            <p className="font-display text-xl italic text-charcoal/40 mb-2">silence...</p>
            <p className="font-body text-sm text-warm-gray">nothing playing right now</p>
          </div>
        )}
      </div>

      {/* Embedded playlist */}
      <div className="mt-8">
        <h4 className="font-display text-lg italic text-charcoal mb-4">current mix</h4>
        <iframe
          className="rounded-xl w-full"
          src="https://open.spotify.com/embed/playlist/71gcONGYJKPYQiGRGYr6Qt?utm_source=generator&theme=0"
          height="352"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist"
        />
      </div>
    </div>
  )
}

export default SpotifyNow
