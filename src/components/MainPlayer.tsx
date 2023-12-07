'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
  EnableRepeatIcon,
  HeartIcon,
  HighVolumeIcon,
  LowVolumeIcon,
  MidVolumeIcon,
  MuteVolumeIcon,
  PauseIcon,
  PlayBeforeIcon,
  PlayIcon,
  PlayNextIcon,
  RandomOffModeIcon
} from './Icons'
import useSpotifySdkPlayer from '@/hooks/use-spotify-sdk-player'
import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom,
  volumeAtom
} from '@/store/atoms/player-atom'
import { pauseSong, playSong } from '@/actions/player'
import { Slider } from './ui/slider'
import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrentSongProgress, formatCurrentSongTime } from '@/lib/utils'
import {
  getUserPlaybackState,
  seekToPosition,
  setPlaybackVolume
} from '@/services/playback'
import { debounce } from 'lodash'

interface Props {
  accessToken: string | undefined
  body: SpotifyApi.CurrentPlaybackResponse | undefined
  statusCode: number
}

export default function MainPlayer({ accessToken, body, statusCode }: Props) {
  useSpotifySdkPlayer({ accessToken })
  const deviceId = useAtomValue(deviceIdAtom)
  const [volumeValue, setVolumeValue] = useAtom(volumeAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)

  useEffect(() => {
    const pauseUserDevice = async () => {
      if (body && statusCode === 200 && body.item?.type === 'track') {
        setCurrentTrack({ song: body.item, progress_ms: body.progress_ms })
        setVolumeValue(body.device.volume_percent ?? 50)
        if (body.is_playing && body.device.id) {
          const { statusCode } = await pauseSong(body.device.id)
          if (statusCode !== 204)
            toast({
              title: 'There was an error',
              description: 'Could not pause the currently playing device.',
              variant: 'destructive'
            })
        }
      }
    }

    pauseUserDevice()
  }, [])

  const handlePlay = async () => {
    if (
      deviceId === undefined ||
      currentTrack === undefined ||
      !currentTrack.song ||
      !currentTrack.progress_ms
    )
      return
    const { statusCode } = await playSong(
      currentTrack.song,
      deviceId,
      currentTrack.progress_ms
    )
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not play the song.',
        variant: 'destructive'
      })
    } else setIsPlaying(true)
  }

  const handlePause = async () => {
    if (
      deviceId === undefined ||
      currentTrack === undefined ||
      !currentTrack.song ||
      !currentTrack.progress_ms
    )
      return
    const { statusCode } = await pauseSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not pause the song, try again later.',
        variant: 'destructive'
      })
    } else setIsPlaying(false)
  }

  const handleVolumeChange = async (newVolume: number) => {
    if (!deviceId) return
    const { statusCode } = await setPlaybackVolume({
      volume: newVolume,
      accessToken,
      deviceId
    })
    if (statusCode !== 204) {
      toast({
        title: 'There was an error',
        description: 'Could not change the volume, try again later.',
        variant: 'destructive'
      })
    } else setVolumeValue(newVolume)
  }

  const handleSongPositionChange = async (newPosition: number) => {
    if (!deviceId) return
    const { statusCode } = await seekToPosition({
      deviceId,
      positionMs: newPosition,
      accessToken
    })
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description:
          'Could not change the position of the song, try again later.',
        variant: 'destructive'
      })
    } else {
      setCurrentTrack((prev) => ({ ...prev!, progress_ms: newPosition }))
    }
  }

  useEffect(() => {
    if (!accessToken) return
    const fetchPlayback = async () => {
      const { statusCode, body } = await getUserPlaybackState(
        undefined,
        accessToken
      )
      if (statusCode === 200 && body && body?.progress_ms)
        setCurrentTrack((prev) => ({ ...prev!, progress_ms: body.progress_ms }))
    }
    const intervalId = isPlaying && setInterval(fetchPlayback, 1000)

    // Clear interval on component unmount or when shouldFetch becomes false
    if (intervalId) return () => clearInterval(intervalId)
  }, [isPlaying, accessToken, setCurrentTrack])

  return (
    <>
      {currentTrack && currentTrack.song ? (
        <div className='flex justify-start items-center gap-3'>
          <Image
            src={
              currentTrack?.song
                ? currentTrack.song.album.images.find(
                    (img) => img.url !== undefined && img.url !== null
                  )?.url
                  ? (currentTrack.song.album.images.find(
                      (img) => img.url !== undefined && img.url !== null
                    )?.url as string)
                  : '/404-img.png'
                : '/404-img.png'
            }
            className='aspect-square'
            height={56}
            width={56}
            alt='Test-player-img'
          />
          <div className='flex flex-col overflow-hidden max-w-[50%]'>
            <Link
              href={'#'}
              className='text-white block truncate text-sm hover:underline'
            >
              {currentTrack.song.name}
            </Link>
            <p className='text-zinc-400 text-[11px] block truncate'>
              {currentTrack.song.artists
                .map((artist) => artist.name)
                .join(', ')}
            </p>
          </div>
          <HeartIcon className='h-4 w-4 fill-zinc-400' />
        </div>
      ) : (
        <div />
      )}
      <div className='flex flex-col items-center justify-between'>
        <div className='flex gap-6 items-center justify-center'>
          <button className='group' disabled={true}>
            <RandomOffModeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button className='group' disabled={true}>
            <PlayBeforeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={!currentTrack || !currentTrack.song}
            className='rounded-full disabled:bg-[#4D4D4D] bg-white p-2 flex items-center justify-center'
          >
            {isPlaying ? (
              <PauseIcon className='h-4 w-4' />
            ) : (
              <PlayIcon className='h-4 w-4' />
            )}
          </button>
          <button className='group' disabled={true}>
            <PlayNextIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button className='group' disabled={true}>
            <EnableRepeatIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
        </div>
        <div className='grid w-full grid-cols-[minmax(20px,auto)_1fr_minmax(20px,auto)] gap-2 items-center justify-center'>
          <div className='flex justify-end items-center text-zinc-400 text-sm'>
            {currentTrack
              ? formatCurrentSongTime(currentTrack.progress_ms ?? 0)
              : '-:--'}
          </div>
          <div className='w-full flex relative flex-col group'>
            <p className='invisible text-xs'>Hidden Text</p>
            <Slider
              disabled={
                !currentTrack || !currentTrack.song || !currentTrack.progress_ms
              }
              value={
                currentTrack && currentTrack?.song && currentTrack.progress_ms
                  ? [
                      formatCurrentSongProgress(
                        currentTrack.progress_ms,
                        currentTrack.song.duration_ms
                      )
                    ]
                  : [0]
              }
              onValueChange={(value) => {
                if (!currentTrack?.song) return
                const [newValue] = value //percent of the song
                const positionMs =
                  (currentTrack.song.duration_ms * newValue) / 100
                handleSongPositionChange(Math.round(positionMs))
              }}
              defaultValue={[0]}
              max={100}
              min={0}
              className='top-1/2 group left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
            />
          </div>
          <div className='flex justify-start items-center text-zinc-400 text-sm'>
            {currentTrack && currentTrack.song
              ? formatCurrentSongTime(currentTrack.song.duration_ms)
              : '-:--'}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-end gap-2'>
        {volumeValue <= 100 && volumeValue >= 60 ? (
          <HighVolumeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
        ) : volumeValue <= 59 && volumeValue >= 30 ? (
          <MidVolumeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
        ) : volumeValue <= 29 && volumeValue > 0 ? (
          <LowVolumeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
        ) : (
          <MuteVolumeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
        )}
        <div className='w-full flex relative flex-col max-w-[50%] group'>
          <p className='invisible text-xs'>Hidden Text</p>
          <Slider
            defaultValue={[50]}
            max={100}
            min={0}
            disabled={!deviceId}
            onValueChange={(value) => {
              const [newVolume] = value
              handleVolumeChange(newVolume)
            }}
            value={[volumeValue]}
            className='top-1/2 left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
          />
        </div>
      </div>
    </>
  )
}
