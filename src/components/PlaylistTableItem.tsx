'use client'

import { cn, formatSongAddedAt, formatSongDuration } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'
import { PlaylistPauseIcon, PlaylistPlayIcon } from './Icons'
import { useAtom, useAtomValue } from 'jotai'
import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom
} from '@/store/atoms/player-atom'
import { pauseSong, playSong } from '@/actions/player'

interface Props {
  track: SpotifyApi.PlaylistTrackObject
  i: number
  token: string | undefined
}

export default function PlaylistTableItem({ track, i }: Props) {
  const [isHovering, setIsHovering] = useState(false)
  const [currentTrack, setCurrentTrackId] = useAtom(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const deviceId = useAtomValue(deviceIdAtom)

  const handlePlaySong = async () => {
    if (!track.track || !deviceId) return
    await playSong(track.track, deviceId)
    setCurrentTrackId(track.track)
    setIsPlaying(true)
  }

  const handlePauseSong = async () => {
    if (!track.track) return
    await pauseSong()
    setIsPlaying(false)
  }

  if (!track.track) return null

  return (
    <article
      className='text-zinc-400 group gap-x-4 py-2 pl-5 items-center grid grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] col-span-5 w-full hover:bg-hover-effect rounded-md'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn('col-start-1 text-center items-center justify-center', {
          'text-[#1ed760]': currentTrack?.id === track.track?.id
        })}
      >
        {isHovering ? (
          currentTrack?.id === track.track?.id && isPlaying ? (
            <button onClick={handlePauseSong}>
              <PlaylistPauseIcon className='h-6 w-6 fill-white' />
            </button>
          ) : (
            <button onClick={handlePlaySong}>
              <PlaylistPlayIcon className='h-6 w-6 fill-white' />
            </button>
          )
        ) : (
          i + 1
        )}
      </div>
      <div className='flex gap-4 col-start-2'>
        <Image
          width={48}
          height={48}
          className='aspect-square rounded-md'
          src={
            track.track
              ? track.track.album.images.find(
                  (img) => img.url !== undefined && img.url !== null
                )?.url
                ? (track.track.album.images.find(
                    (img) => img.url !== undefined && img.url !== null
                  )?.url as string)
                : '/404-img.png'
              : '/404-img.png'
          }
          alt={`Cover image of song #${track.track ? track.track.id : i + 1}`}
        />
        <div className='flex flex-col'>
          <div className='table table-fixed w-full'>
            <h3
              className={cn(
                'text-white block truncate hover:cursor-pointer hover:underline',
                { 'text-[#1ed760]': currentTrack?.id === track.track?.id }
              )}
            >
              {track.track ? track.track.name : 'Unknown'}
            </h3>
          </div>
          {track.track ? (
            <div className='table table-fixed w-full'>
              <span className='block truncate'>
                {track.track.artists.map((artist) => artist.name).join(', ') ??
                  'Unknown'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className='w-full col-start-3 overflow-hidden'>
        <span className='block truncate'>
          {track.track ? track.track.album.name : 'Unknown'}
        </span>
      </div>
      <div className='col-start-4'>
        {track.added_at ? formatSongAddedAt(track.added_at) : 'Unknown'}
      </div>
      <div className='col-start-5 flex justify-center'>
        {track.track ? formatSongDuration(track.track.duration_ms) : '?'}
      </div>
    </article>
  )
}
