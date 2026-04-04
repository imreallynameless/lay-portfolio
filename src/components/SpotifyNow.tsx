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
      animate(cardRef.current, {
        opacity: [0, 1],
        duration: 500,
        ease: 'outCubic',
      })
    }
  }, [loading])

  if (loading) {
    return <p className="font-body text-xs text-warm-gray animate-pulse">...</p>
  }

  return (
    <div ref={cardRef} className="opacity-0 h-full flex flex-col">
      <h3 className="font-display text-base italic text-charcoal mb-3">
        {track?.is_playing ? 'playing' : 'spotify'}
      </h3>

      {track?.item ? (
        <a
          href={track.item.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col group min-h-0"
        >
          <div className="relative flex-shrink-0 mb-2">
            <img
              src={track.item.album.images[0]?.url}
              alt={track.item.album.name}
              className="w-full aspect-square object-cover group-hover:opacity-80 transition-opacity"
            />
            {track.is_playing && (
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold animate-pulse" />
            )}
          </div>

          <p className="font-body text-xs text-charcoal font-medium truncate group-hover:text-gold-dark transition-colors">
            {track.item.name}
          </p>
          <p className="font-body text-[10px] text-warm-gray truncate mt-0.5">
            {track.item.artists.map((a) => a.name).join(', ')}
          </p>

          {track.is_playing && (
            <div className="mt-2 h-[2px] bg-charcoal/10">
              <div
                className="h-full bg-gold"
                style={{ width: `${(track.progress_ms / track.item.duration_ms) * 100}%` }}
              />
            </div>
          )}
        </a>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-body text-xs text-warm-gray">nothing playing</p>
        </div>
      )}
    </div>
  )
}

export default SpotifyNow
