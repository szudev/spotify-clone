'use client'

import { formatSongAddedAt, formatSongDuration } from '@/lib/utils'
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
import { toast } from '@/hooks/use-toast'

interface Props {
  track: SpotifyApi.PlaylistTrackObject
  i: number
  token: string | undefined
  uris: string[]
  tracks: (SpotifyApi.TrackObjectFull | null)[]
  playlistId: string
}

export default function PlaylistTableItem({
  track,
  i,
  uris,
  tracks,
  playlistId
}: Props) {
  const [isHovering, setIsHovering] = useState(false)
  const [currentTrack, setCurrentTrackId] = useAtom(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const deviceId = useAtomValue(deviceIdAtom)

  const handlePlaySong = async () => {
    if (!track.track || !deviceId) return
    const { statusCode } = await playSong(
      uris.slice(i, uris.length),
      deviceId,
      currentTrack &&
        currentTrack.song &&
        currentTrack.progress_ms &&
        currentTrack.song.id === track.track.id
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
        song: track.track,
        progress_ms:
          currentTrack &&
          currentTrack.progress_ms &&
          currentTrack.song &&
          currentTrack.song.id === track.track.id
            ? currentTrack.progress_ms
            : 0,
        tracks: tracks,
        playlistId: playlistId
      })
      setIsPlaying(true)
    }
  }

  const handlePauseSong = async () => {
    if (!track.track || !deviceId) return
    const { statusCode } = await pauseSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not pause the song, try again later.',
        variant: 'destructive'
      })
    } else setIsPlaying(false)
  }

  if (!track.track) return null

  return (
    <>
      <article
        className='text-zinc-400 hidden group gap-x-4 py-2 md:pl-5 pl-0 items-center md:grid grid-cols-[25%_1fr] md:grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] md:col-span-5 w-full md:hover:bg-hover-effect rounded-md'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className={`${
            currentTrack?.song?.id === track.track.id
              ? 'text-[#1ed760]'
              : 'text-zinc-400'
          } md:col-start-1 hidden md:flex text-center items-center justify-center`}
        >
          {isHovering ? (
            currentTrack?.song?.id === track.track.id && isPlaying ? (
              <button onClick={handlePauseSong}>
                <PlaylistPauseIcon className='h-6 w-6 fill-white' />
              </button>
            ) : (
              <button onClick={handlePlaySong}>
                <PlaylistPlayIcon className='h-6 w-6 fill-white' />
              </button>
            )
          ) : isPlaying && currentTrack?.song?.id === track.track.id ? (
            <Image
              src={'/song-playing.gif'}
              alt={`playing-song-#${track.track.id}`}
              className='aspect-square'
              width={14}
              height={14}
            />
          ) : (
            i + 1
          )}
        </div>
        <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1'>
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
                className={`${
                  currentTrack?.song?.id === track.track.id
                    ? 'text-[#1ed760]'
                    : 'text-white'
                } block truncate hover:cursor-pointer hover:underline`}
              >
                {track.track ? track.track.name : 'Unknown'}
              </h3>
            </div>
            {track.track ? (
              <div className='table table-fixed w-full'>
                <span className='block truncate'>
                  {track.track.artists
                    .map((artist) => artist.name)
                    .join(', ') ?? 'Unknown'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className='w-full col-start-3 overflow-hidden hidden md:inline'>
          <span className='block truncate'>
            {track.track ? track.track.album.name : 'Unknown'}
          </span>
        </div>
        <div className='col-start-4 hidden md:inline'>
          {track.added_at ? formatSongAddedAt(track.added_at) : 'Unknown'}
        </div>
        <div className='col-start-5 md:flex justify-center hidden'>
          {track.track ? formatSongDuration(track.track.duration_ms) : '-:--'}
        </div>
      </article>
      <button
        className='text-zinc-400 group md:hidden gap-x-4 py-2 md:pl-5 pl-0 items-center grid grid-cols-[25%_1fr] md:grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] md:col-span-5 w-full md:hover:bg-hover-effect rounded-md'
        onClick={isPlaying ? handlePauseSong : handlePlaySong}
      >
        <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1'>
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
          <div className='flex'>
            <div className='flex flex-col text-start'>
              <div className='table table-fixed w-full'>
                <h3
                  className={`${
                    currentTrack?.song?.id === track.track.id
                      ? 'text-[#1ed760]'
                      : 'text-white'
                  } block truncate hover:cursor-pointer`}
                >
                  {track.track ? track.track.name : 'Unknown'}
                </h3>
              </div>
              {track.track ? (
                <div className='table table-fixed w-full'>
                  <span className='block truncate'>
                    {track.track.artists
                      .map((artist) => artist.name)
                      .join(', ') ?? 'Unknown'}
                  </span>
                </div>
              ) : null}
            </div>
            {isPlaying && currentTrack?.song?.id === track.track.id ? (
              <Image
                src={'/song-playing.gif'}
                alt={`playing-song-#${track.track.id}`}
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
