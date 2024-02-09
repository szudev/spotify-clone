'use client'
import Image from 'next/image'
import ClientCoverPlayer from './ClientCoverPlayer'
import CustomSearchedSongName from './CustomSearchedSongName'
import CustomSearchedSongDuration from './CustomSearchedSongDuration'
import { useAtom, useAtomValue } from 'jotai'
import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom
} from '@/store/atoms/player-atom'
import { pauseSong, playSong } from '@/actions/player'
import { toast } from '@/hooks/use-toast'

interface Props {
  track: SpotifyApi.TrackObjectFull
  i: number
}

export default function CustomSearchedSongItem({ track, i }: Props) {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
  const deviceId = useAtomValue(deviceIdAtom)

  const handlePlaySong = async () => {
    if (!deviceId) return
    const { statusCode } = await playSong(
      track.uri,
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
        tracks: [track],
        songObject: track
      })
      setIsPlaying(true)
    }
  }

  const handlePauseSong = async () => {
    if (!deviceId) return
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
        key={track.id}
        className='hidden md:grid grid-cols-[1fr_minmax(30px,auto)] rounded-md group md:bg-hover-effect md:p-2 p-0 items-center'
      >
        <div className='grid md:grid-cols-[40px_1fr] grid-cols-[25%_1fr] md:gap-4 gap-2'>
          <div className='rounded-md relative'>
            <Image
              width={40}
              height={40}
              className='aspect-square md:group-hover:brightness-[.35] w-full h-auto rounded-md'
              src={
                track
                  ? track.album.images.find(
                      (img) => img.url !== undefined && img.url !== null
                    )?.url
                    ? (track.album.images.find(
                        (img) => img.url !== undefined && img.url !== null
                      )?.url as string)
                    : '/404-img.png'
                  : '/404-img.png'
              }
              alt={`Cover image of song #${track ? track.id : i + 1}`}
            />
            <ClientCoverPlayer
              playerType='song'
              song={track}
              uris={track.uri}
              tracks={[track]}
              iconStyles='h-1/2 w-1/2 fill-white'
              buttonStyles='w-full h-full absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 group-hover:opacity-100 opacity-0 hidden md:flex items-center justify-center'
              onPlayStyle=''
            />
          </div>
          <div className='flex flex-col justify-center'>
            <div className='table table-fixed w-full'>
              <CustomSearchedSongName track={track} />
            </div>
            {track ? (
              <div className='table table-fixed w-full'>
                <span className='block text-xs truncate text-zinc-400'>
                  {track.artists.map((artist) => artist.name).join(', ') ??
                    'Unknown'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <CustomSearchedSongDuration track={track} />
      </article>
      <button
        onClick={isPlaying ? handlePauseSong : handlePlaySong}
        className='md:hidden grid grid-cols-[1fr_minmax(30px,auto)] rounded-md group md:bg-hover-effect md:p-2 p-0 items-center'
      >
        <div className='grid md:grid-cols-[40px_1fr] grid-cols-[25%_1fr] md:gap-4 gap-2'>
          <div className='rounded-md relative'>
            <Image
              width={40}
              height={40}
              className='aspect-square md:group-hover:brightness-[.35] w-full h-auto rounded-md'
              src={
                track
                  ? track.album.images.find(
                      (img) => img.url !== undefined && img.url !== null
                    )?.url
                    ? (track.album.images.find(
                        (img) => img.url !== undefined && img.url !== null
                      )?.url as string)
                    : '/404-img.png'
                  : '/404-img.png'
              }
              alt={`Cover image of song #${track ? track.id : i + 1}`}
            />
          </div>
          <div className='flex flex-col justify-center'>
            <div className='table table-fixed w-full text-start'>
              <CustomSearchedSongName track={track} />
            </div>
            {track ? (
              <div className='table table-fixed w-full text-start'>
                <span className='block text-xs truncate text-zinc-400'>
                  {track.artists.map((artist) => artist.name).join(', ') ??
                    'Unknown'}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </button>
    </>
  )
}
