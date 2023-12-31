'use client'

import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom
} from '@/store/atoms/player-atom'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { PlaylistPauseIcon, PlaylistPlayIcon } from './Icons'
import { pauseSong, playSong } from '@/actions/player'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { formatSongDuration } from '@/lib/utils'
import { type AlbumTrackMergeType } from '@/types/spotify-web-api-node'

interface Props {
  track: AlbumTrackMergeType
  i: number
  token: string | undefined
  uris: string[]
  tracks: AlbumTrackMergeType[]
  albumId: string
}

export default function AlbumTableItem({
  track,
  i,
  tracks,
  uris,
  albumId
}: Props) {
  const [isHovering, setIsHovering] = useState(false)
  const [currentTrack, setCurrentTrackId] = useAtom(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const deviceId = useAtomValue(deviceIdAtom)

  const handlePlaySong = async () => {
    if (!track || !deviceId) return
    const { statusCode } = await playSong(
      uris.slice(i, uris.length),
      deviceId,
      currentTrack &&
        currentTrack.song &&
        currentTrack.progress_ms &&
        currentTrack.song.id === track.id
        ? currentTrack.progress_ms
        : 0
    )
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not play the song, try again later.',
        variant: 'destructive'
      })
    } else {
      setCurrentTrackId({
        song: track,
        progress_ms:
          currentTrack &&
          currentTrack.progress_ms &&
          currentTrack.song &&
          currentTrack.song.id === track.id
            ? currentTrack.progress_ms
            : 0,
        tracks: tracks.slice(i, tracks.length),
        albumId: albumId
      })
      setIsPlaying(true)
    }
  }

  const handlePauseSong = async () => {
    if (!track || !deviceId) return
    const { statusCode } = await pauseSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not pause the song, try again later.',
        variant: 'destructive'
      })
    } else setIsPlaying(false)
  }

  return (
    <>
      <article
        className='text-zinc-400 hidden group gap-x-4 pr-3 py-2 md:pl-5 pl-0 items-center md:grid grid-cols-[25%_1fr] md:grid-cols-[minmax(30px,auto)_1fr_auto] md:col-span-3 w-full md:hover:bg-hover-effect rounded-md'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`${
            currentTrack?.song?.id === track.id
              ? 'text-[#1ed760]'
              : 'text-zinc-400'
          } md:col-start-1 hidden md:flex text-center items-center justify-center`}
        >
          {isHovering ? (
            currentTrack?.song?.id === track.id && isPlaying ? (
              <button onClick={handlePauseSong}>
                <PlaylistPauseIcon className='h-6 w-6 fill-white' />
              </button>
            ) : (
              <button onClick={handlePlaySong}>
                <PlaylistPlayIcon className='h-6 w-6 fill-white' />
              </button>
            )
          ) : isPlaying && currentTrack?.song?.id === track.id ? (
            <Image
              src={'/song-playing.gif'}
              alt={`playing-song-#${track.id}`}
              className='aspect-square'
              width={14}
              height={14}
            />
          ) : (
            i + 1
          )}
        </div>
        <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1'>
          <div className='flex flex-col'>
            <div className='table table-fixed w-full'>
              <h3
                className={`${
                  currentTrack?.song?.id === track.id
                    ? 'text-[#1ed760]'
                    : 'text-white'
                } block truncate hover:cursor-pointer hover:underline`}
              >
                {track ? track.name : 'Unknown'}
              </h3>
            </div>
            {track ? (
              <div className='table table-fixed w-full'>
                <span className='block truncate'>
                  {track.artists.map((artist) => artist.name).join(', ') ??
                    'Unknown'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className='col-start-3 md:flex justify-center hidden'>
          {track ? formatSongDuration(track.duration_ms) : '-:--'}
        </div>
      </article>
      <button
        className='text-zinc-400 group md:hidden gap-x-4 py-2 md:pl-5 pl-0 items-center grid grid-cols-[25%_1fr] w-full rounded-md'
        onClick={isPlaying ? handlePauseSong : handlePlaySong}
      >
        <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1'>
          <div className='flex'>
            <div className='flex flex-col text-start'>
              <div className='table table-fixed w-full'>
                <h3
                  className={`${
                    currentTrack?.song?.id === track.id
                      ? 'text-[#1ed760]'
                      : 'text-white'
                  } block truncate hover:cursor-pointer`}
                >
                  {track ? track.name : 'Unknown'}
                </h3>
              </div>
              {track ? (
                <div className='table table-fixed w-full'>
                  <span className='block truncate'>
                    {track.artists.map((artist) => artist.name).join(', ') ??
                      'Unknown'}
                  </span>
                </div>
              ) : null}
            </div>
            {isPlaying && currentTrack?.song?.id === track.id ? (
              <Image
                src={'/song-playing.gif'}
                alt={`playing-song-#${track.id}`}
                className='aspect-square self-end'
                width={14}
                height={14}
              />
            ) : null}
          </div>
        </div>
      </button>
    </>
  )
}
