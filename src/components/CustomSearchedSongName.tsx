'use client'

import { currentTrackAtom } from '@/store/atoms/player-atom'
import { useAtomValue } from 'jotai'
import Link from 'next/link'

interface Props {
  track: SpotifyApi.TrackObjectFull
}

export default function CustomSearchedSongName({ track }: Props) {
  const currentTrack = useAtomValue(currentTrackAtom)
  return (
    <Link
      href={`/album/${track.album.id}`}
      className={`${
        currentTrack?.song?.id === track.id ? 'text-[#1ed760]' : 'text-white'
      } block truncate md:text-sm text-base hover:cursor-pointer hover:underline`}
    >
      {track ? track.name : 'Unknown'}
    </Link>
  )
}
