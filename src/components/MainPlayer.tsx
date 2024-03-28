'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
  EnableRepeatIcon,
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
  volumeAtom,
  playerErrorAtom
} from '@/store/atoms/player-atom'
import {
  pauseSong,
  playSong,
  SkipNextSong,
  SkipPreviousSong
} from '@/actions/player'
import { Slider } from './ui/slider'
import { useCallback, useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import Link from 'next/link'
import {
  cn,
  formatCurrentSongProgress,
  formatCurrentSongTime
} from '@/lib/utils'
import {
  getUserPlaybackState,
  seekToPosition,
  setPlaybackVolume
} from '@/services/playback'
import debounce from 'lodash/debounce'

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
  const playerError = useAtomValue(playerErrorAtom)
  const [isChangingSongPosition, setIsChangingSongPosition] =
    useState<boolean>(false)

  const debounceVolumeChange = useCallback(
    (newVolume: number, targetDevice: string | undefined) => {
      const initialValue = volumeValue
      debouncedVolumeChangeRequest(newVolume, initialValue, targetDevice)
    },
    []
  )

  const debounceSongPositionChange = useCallback(
    (newPosition: number, targetDevice: string | undefined) => {
      const initialValue = currentTrack?.progress_ms ?? 0
      debouncedSongPositionChange(newPosition, initialValue, targetDevice)
    },
    []
  )

  const debouncedVolumeChangeRequest = debounce(
    async (
      newVolume: number,
      initialValue: number,
      targetDevice: string | undefined
    ) => {
      await handleVolumeChange(newVolume, initialValue, targetDevice)
    },
    500
  )

  const debouncedSongPositionChange = debounce(
    async (
      newPosition: number,
      initialValue: number,
      targetDevice: string | undefined
    ) =>
      await handleSongPositionChange(newPosition, initialValue, targetDevice),
    500
  )

  useEffect(() => {
    const pauseUserDevice = async () => {
      if (body && statusCode === 200 && body.item?.type === 'track') {
        setCurrentTrack({
          song: body.item,
          progress_ms: body.progress_ms,
          tracks: [body.item] ?? []
        })
        setVolumeValue(50)
        if (body.is_playing && body.device.id) {
          await pauseSong(body.device.id)
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
    ) {
      if (!deviceId) {
        toast({
          title: 'Error on player',
          description:
            playerError?.description ??
            'Could not perform the player action, try reloading the page',
          variant: 'destructive'
        })
      }
      return
    }
    const index = currentTrack.tracks
      .filter((track) => track !== null)
      .findIndex((track) => track!.id === currentTrack.song?.id)
    const { statusCode } = await playSong(
      [
        ...currentTrack.tracks
          .filter((track) => track !== null)
          .slice(index, currentTrack.tracks.length)
          .map((track) => track!.uri),
        currentTrack.song.uri
      ],
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
    ) {
      if (!deviceId) {
        toast({
          title: 'Error on player',
          description:
            playerError?.description ??
            'Could not perform the player action, try reloading the page',
          variant: 'destructive'
        })
      }
      return
    }
    const { statusCode } = await pauseSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not pause the song, try again later.',
        variant: 'destructive'
      })
    } else setIsPlaying(false)
  }

  const handleVolumeChange = async (
    newVolume: number,
    initialValue: number,
    targetDevice: string | undefined
  ) => {
    if (!targetDevice) {
      if (!targetDevice) {
        toast({
          title: 'Error on player',
          description:
            playerError?.description ??
            'Could not perform the player action, try reloading the page',
          variant: 'destructive'
        })
      }
      return
    }
    const { statusCode } = await setPlaybackVolume({
      volume: newVolume,
      accessToken,
      deviceId: targetDevice
    })
    if (statusCode !== 204) {
      setVolumeValue(initialValue)
      toast({
        title: 'There was an error',
        description: 'Could not change the volume, try again later.',
        variant: 'destructive'
      })
    } else setVolumeValue(newVolume)
  }

  const handleSongPositionChange = debounce(
    async (
      newPosition: number,
      initialValue: number,
      targetDevice: string | undefined
    ) => {
      if (!targetDevice) {
        if (!targetDevice) {
          toast({
            title: 'Error on player',
            description:
              playerError?.description ??
              'Could not perform the player action, try reloading the page',
            variant: 'destructive'
          })
        }
        return
      }
      const { statusCode } = await seekToPosition({
        deviceId: targetDevice,
        positionMs: newPosition,
        accessToken
      })
      if (statusCode !== 202) {
        setCurrentTrack((prev) => ({ ...prev!, progress_ms: initialValue }))
        setIsChangingSongPosition(false)
        toast({
          title: 'There was an error',
          description:
            'Could not change the position of the song, try again later.',
          variant: 'destructive'
        })
      } else {
        setIsChangingSongPosition(false)
        setCurrentTrack((prev) => ({ ...prev!, progress_ms: newPosition }))
      }
    },
    500
  )

  useEffect(() => {
    if (!accessToken) return
    const fetchPlayback = async () => {
      const { statusCode, body } = await getUserPlaybackState(
        undefined,
        accessToken
      )
      if (
        statusCode === 200 &&
        body &&
        body?.progress_ms &&
        !isChangingSongPosition
      )
        setCurrentTrack((prev) => ({
          ...prev!,
          progress_ms: body.progress_ms,
          song:
            body.item?.type === 'track' ? body.item : currentTrack?.song ?? null
        }))
    }
    const intervalId = isPlaying && setInterval(fetchPlayback, 1000)

    // Clear interval on component unmount or when shouldFetch becomes false
    if (intervalId) return () => clearInterval(intervalId)
  }, [isPlaying, accessToken, setCurrentTrack])

  const handlePlayNextSong = async () => {
    if (
      !deviceId ||
      !currentTrack ||
      currentTrack.tracks.length <= 1 ||
      currentTrack.tracks.findIndex(
        (track) => track?.id === currentTrack.song?.id
      ) ===
        currentTrack.tracks.length - 1
    ) {
      if (!deviceId) {
        toast({
          title: 'Error on player',
          description:
            playerError?.description ??
            'Could not perform the player action, try reloading the page',
          variant: 'destructive'
        })
      }
      return
    }
    const { statusCode } = await SkipNextSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not skip to the next song, try again later.',
        variant: 'destructive'
      })
    }
  }

  const handlePlayPreviousSong = async () => {
    if (
      !deviceId ||
      !currentTrack ||
      currentTrack.tracks.length <= 1 ||
      currentTrack.tracks.findIndex(
        (track) => track?.id === currentTrack.song?.id
      ) === 0
    ) {
      if (!deviceId) {
        toast({
          title: 'Error on player',
          description:
            playerError?.description ??
            'Could not perform the player action, try reloading the page',
          variant: 'destructive'
        })
      }
      return
    }
    const { statusCode } = await SkipPreviousSong(deviceId)
    if (statusCode !== 202) {
      toast({
        title: 'There was an error',
        description: 'Could not skip to the previous song, try again later.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div
      className={cn(
        'grid md:grid-cols-[30%_40%_30%] px-2 pt-2 md:px-0 md:pt-0 grid-cols-[85%_1fr] md:[grid-template-areas:"song_player_sound"] [grid-template-areas:"song_player"_"progress_progress"] grid-rows-[1fr_auto] bg-blue-950 md:rounded-none md:bg-transparent rounded-lg',
        {
          'hidden md:grid': !currentTrack
        }
      )}
    >
      {currentTrack && currentTrack.song ? (
        <div className='grid grid-cols-[15%,1fr] md:grid-cols-[auto_1fr] justify-center items-center gap-2 md:gap-3 [grid-area:song]'>
          <div className='w-full h-auto'>
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
              className='rounded-md aspect-square w-full h-[52px]'
              height={42}
              width={42}
              alt='Current track cover'
            />
          </div>
          <div className='flex flex-col overflow-hidden md:max-w-[85%] max-w-[90%]'>
            <Link
              href={`/album/${currentTrack.song.album.id}`}
              className='text-white font-bold md:font-normal block truncate text-sm hover:underline'
            >
              {currentTrack.song.name}
            </Link>
            <div className='hidden text-[11px] md:flex truncate'>
              {currentTrack.song.artists.map((artist, index, arr) => (
                <Link
                  href={`/artist/${artist.id}`}
                  key={artist.id}
                  className='text-zinc-400 group block truncate'
                >
                  <span className='group-hover:underline group-focus:text-white group-hover:text-white'>
                    {artist.name}
                  </span>
                  {index < arr.length - 1 ? ', ' : null}
                </Link>
              ))}
            </div>
            <p className='block truncate md:hidden text-[11px] font-bold text-[#1ed760]'>
              {body && body.device
                ? `${body.device.name}`
                : currentTrack.song.artists
                    .map((artist) => artist.name)
                    .join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <div className='[grid-area:song]' />
      )}
      <div className='flex flex-col items-center md:justify-between justify-center [grid-area:player]'>
        <div className='flex gap-6 items-center justify-center'>
          <button className='group hidden md:inline' disabled={true}>
            <RandomOffModeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button
            className='group hidden md:inline'
            disabled={
              !deviceId ||
              !currentTrack ||
              currentTrack.tracks.length <= 1 ||
              currentTrack.tracks.findIndex(
                (track) => track?.id === currentTrack.song?.id
              ) === 0
            }
            onClick={handlePlayPreviousSong}
          >
            <PlayBeforeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            disabled={!currentTrack || !currentTrack.song}
            className='rounded-full disabled:bg-[#4D4D4D] md:bg-white bg-transparent p-2 flex items-center justify-center z-20'
          >
            {isPlaying ? (
              <PauseIcon className='md:h-4 md:w-4 h-auto w-6 fill-white md:fill-black' />
            ) : (
              <PlayIcon className='md:h-4 md:w-4 h-auto w-6 fill-white md:fill-black' />
            )}
          </button>
          <button
            className='group hidden md:inline'
            disabled={
              !deviceId ||
              !currentTrack ||
              currentTrack.tracks.length <= 1 ||
              currentTrack.tracks.findIndex(
                (track) => track?.id === currentTrack.song?.id
              ) ===
                currentTrack.tracks.length - 1
            }
            onClick={handlePlayNextSong}
          >
            <PlayNextIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
          <button className='group hidden md:inline' disabled={true}>
            <EnableRepeatIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
          </button>
        </div>
        <div className='hidden md:grid w-full grid-cols-[minmax(20px,auto)_1fr_minmax(20px,auto)] gap-2 items-center justify-center'>
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
                const newPosition = Math.round(positionMs)
                setCurrentTrack((prev) => ({
                  ...prev!,
                  progress_ms: newPosition
                }))
                setIsChangingSongPosition(true)
                const targetDevice = deviceId
                debounceSongPositionChange(newPosition, targetDevice)
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
      <div className='md:flex items-center justify-end gap-2 md:[grid-area:sound] hidden'>
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
              setVolumeValue(newVolume)
              const targetDevice = deviceId
              debounceVolumeChange(newVolume, targetDevice)
            }}
            value={[volumeValue]}
            className='top-1/2 left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
          />
        </div>
      </div>
      <div className='md:hidden pt-1 [grid-area:progress] w-full flex items-center justify-between'>
        <div className='flex items-center justify-center w-full'>
          <div className='w-full flex group'>
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
                const newPosition = Math.round(positionMs)
                setCurrentTrack((prev) => ({
                  ...prev!,
                  progress_ms: newPosition
                }))
                setIsChangingSongPosition(true)
                const targetDevice = deviceId
                debounceSongPositionChange(newPosition, targetDevice)
              }}
              defaultValue={[0]}
              max={100}
              min={0}
              className='group z-20'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
