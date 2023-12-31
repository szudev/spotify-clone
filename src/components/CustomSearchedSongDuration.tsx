'use client'
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from '@/lib/utils'
import { currentTrackAtom, isPlayingAtom } from '@/store/atoms/player-atom'
import { useAtomValue } from 'jotai'

interface Props {
  track: SpotifyApi.TrackObjectFull
}

export default function CustomSearchedSongDuration({ track }: Props) {
  const currentTrack = useAtomValue(currentTrackAtom)
  const isPlaying = useAtomValue(isPlayingAtom)
  return (
    <div className='col-start-5 md:flex text-sm justify-center text-zinc-400 hidden'>
      {track.id === currentTrack?.song?.id && isPlaying ? (
        <img
          src={'/song-playing.gif'}
          alt={`playing-song-#${track.id}`}
          className='aspect-square'
          height={14}
          width={14}
        />
      ) : track ? (
        formatSongDuration(track.duration_ms)
      ) : (
        '-:--'
      )}
    </div>
  )
}
