'use client'

import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom
} from '@/store/atoms/player-atom'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import { PlaylistPauseIcon, PlaylistPlayIcon } from './Icons'
import Image from 'next/image'
import { pauseSong, playSong } from '@/actions/player'
import { toast } from '@/hooks/use-toast'
import { formatSongDuration } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  track: SpotifyApi.TrackObjectFull
  i: number
  uris: string[]
  tracks: (SpotifyApi.TrackObjectFull | null)[]
  artistId: string
}

export default function ClientTopArtistTrackItem({
  track,
  i,
  tracks,
  uris,
  artistId
}: Props) {
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [isHovering, setIsHovering] = useState(false)
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
      setCurrentTrack({
        song: track,
        progress_ms:
          currentTrack &&
          currentTrack.progress_ms &&
          currentTrack.song &&
          currentTrack.song.id === track.id
            ? currentTrack.progress_ms
            : 0,
        tracks: tracks,
        artistId: artistId
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

  const trackImgSrc =
    track.album.images.find((image) => image.url)?.url ?? '/404-img.png'

  return (
    <>
      <article
        key={track.id}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className='md:grid hidden gap-2 text-sm md:grid-cols-[minmax(30px,auto)_1fr_1fr_minmax(30px,auto)] grid-cols-[minmax(30px,auto)_1fr] rounded-md group md:bg-hover-effect md:p-2 p-0 items-center'
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
                <PlaylistPauseIcon className='h-4 w-4 fill-white' />
              </button>
            ) : (
              <button onClick={handlePlaySong}>
                <PlaylistPlayIcon className='h-4 w-4 fill-white' />
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
        <div className='grid md:grid-cols-[45px_1fr] grid-cols-[25%_1fr] gap-3'>
          <div className='rounded-md relative'>
            <Image
              width={45}
              height={45}
              className='aspect-square w-full h-auto rounded-md'
              src={trackImgSrc}
              alt={`Track #${track.id} cover image`}
            />
          </div>
          <div className='flex items-center flex-col md:flex-row justify-center'>
            <div className='table table-fixed w-full'>
              <span
                className={`${
                  currentTrack?.song?.id === track.id
                    ? 'text-[#1ed760]'
                    : 'md:text-zinc-400 text-white'
                } block truncate`}
              >
                {track.name}
              </span>
            </div>
            <div className='table table-fixed w-full md:hidden'>
              <span className='block truncate text-xs text-zinc-400'>
                {track.artists.map((artist) => artist.name).join(', ') ??
                  'Unknown'}
              </span>
            </div>
          </div>
        </div>
        <div className='col-start-3 hidden md:flex items-center'>
          <Link
            href={`/album/${track.album.id}`}
            className='table table-fixed w-full hover:underline focus:underline text-zinc-400'
          >
            <span className='block truncate'>{track.album.name}</span>
          </Link>
        </div>
        <div className='hidden md:flex md:col-start-4 text-zinc-400'>
          {formatSongDuration(track.duration_ms)}
        </div>
      </article>
      <button
        onClick={isPlaying ? handlePauseSong : handlePlaySong}
        className='md:hidden grid gap-2 text-sm md:grid-cols-[minmax(30px,auto)_1fr_1fr_minmax(30px,auto)] grid-cols-[minmax(30px,auto)_1fr] rounded-md group md:bg-hover-effect md:p-2 p-0'
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
              <div>
                <PlaylistPauseIcon className='h-4 w-4 fill-white' />
              </div>
            ) : (
              <div>
                <PlaylistPlayIcon className='h-4 w-4 fill-white' />
              </div>
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
        <div className='grid md:grid-cols-[45px_1fr] grid-cols-[25%_1fr] gap-3'>
          <div className='rounded-md relative'>
            <Image
              width={45}
              height={45}
              className='aspect-square w-full h-auto rounded-md'
              src={trackImgSrc}
              alt={`Track #${track.id} cover image`}
            />
          </div>
          <div className='flex flex-col md:flex-row justify-center'>
            <div className='table table-fixed w-full text-start'>
              <span
                className={`${
                  currentTrack?.song?.id === track.id
                    ? 'text-[#1ed760]'
                    : 'md:text-zinc-400 text-white'
                } block truncate`}
              >
                {track.name}
              </span>
            </div>
            <div className='table table-fixed w-full md:hidden text-start'>
              <span className='block truncate text-xs text-zinc-400'>
                {track.artists.map((artist) => artist.name).join(', ') ??
                  'Unknown'}
              </span>
            </div>
          </div>
        </div>
        <div className='col-start-3 hidden md:flex items-center'>
          <Link
            href={`/album/${track.album.id}`}
            className='table table-fixed w-full hover:underline focus:underline text-zinc-400'
          >
            <span className='block truncate'>{track.album.name}</span>
          </Link>
        </div>
        <div className='hidden md:flex md:col-start-4 text-zinc-400'>
          {formatSongDuration(track.duration_ms)}
        </div>
      </button>
    </>
  )
}
