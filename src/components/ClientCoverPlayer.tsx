'use client'

import { PauseIcon, PlayIcon } from './Icons'
import {
  currentTrackAtom,
  deviceIdAtom,
  isPlayingAtom
} from '@/store/atoms/player-atom'
import { useAtom, useAtomValue } from 'jotai'
import { pauseSong, playSong } from '@/actions/player'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type ArtistProps = {
  playerType: 'artist'
  artistId: string
}

type SongProps = {
  playerType: 'song'
  song: SpotifyApi.TrackObjectFull
}

type AlbumProps = {
  playerType: 'album'
  albumId: string
}

type PlaylistProps = {
  playerType: 'playlist'
  playlistId: string
}

type Props = {
  buttonStyles: React.ComponentProps<'div'>['className']
  iconStyles: React.ComponentProps<'div'>['className']
  onPlayStyle: React.ComponentProps<'div'>['className']
  uris: string | string[]
  tracks: (SpotifyApi.TrackObjectFull | null)[]
} & (SongProps | AlbumProps | PlaylistProps | ArtistProps)

export default function ClientCoverPlayer(props: Props) {
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom)
  const deviceId = useAtomValue(deviceIdAtom)
  const { buttonStyles, iconStyles, playerType, tracks, uris } = props

  const albumIdSetter = playerType === 'album' ? props.albumId : undefined
  const playlistIdSetter =
    playerType === 'playlist' ? props.playlistId : undefined
  const songObjectSetter = playerType === 'song' ? props.song : undefined
  const artistIdSetter = playerType === 'artist' ? props.artistId : undefined

  const track =
    playerType === 'song'
      ? props.song
      : tracks.find(
          (trackToFind) => trackToFind?.id === currentTrack?.song?.id
        ) ?? tracks[0]

  const index =
    playerType === 'album'
      ? currentTrack?.tracks
        ? props.albumId === currentTrack.albumId
          ? currentTrack.tracks.findIndex(
              (trackToFind) => trackToFind?.id === track?.id
            ) ?? 0
          : 0
        : 0
      : playerType === 'playlist'
      ? currentTrack?.tracks
        ? props.playlistId === currentTrack.playlistId
          ? currentTrack.tracks.findIndex(
              (trackToFind) => trackToFind?.id === track?.id
            ) ?? 0
          : 0
        : 0
      : playerType === 'artist'
      ? currentTrack?.tracks
        ? props.artistId === currentTrack.artistId
          ? currentTrack.tracks.findIndex(
              (trackToFind) => trackToFind?.id === track?.id
            )
          : 0
        : 0
      : 0

  const isPlayingForType =
    (playerType === 'album' && props.albumId === currentTrack?.albumId) ||
    (playerType === 'playlist' &&
      props.playlistId === currentTrack?.playlistId) ||
    (playerType === 'song' && props.song.id === currentTrack?.song?.id) ||
    (playerType === 'artist' && props.artistId === currentTrack?.artistId)

  const handlePlay = async () => {
    if (!track || !deviceId) return
    const { statusCode } = await playSong(
      typeof uris === 'string' ? uris : uris.slice(index, uris.length),
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
        albumId: albumIdSetter,
        playlistId: playlistIdSetter,
        songObject: songObjectSetter,
        artistId: artistIdSetter
      })
      setIsPlaying(true)
    }
  }

  const handlePause = async () => {
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
    <button
      className={cn(buttonStyles, {
        [`${props.onPlayStyle}`]:
          (props.playerType === 'playlist' &&
            props.playlistId === currentTrack?.playlistId) ||
          (props.playerType === 'album' &&
            props.albumId === currentTrack?.albumId) ||
          (props.playerType === 'song' &&
            props.song.id === currentTrack?.song?.id) ||
          (props.playerType === 'artist' &&
            props.artistId === currentTrack?.artistId)
      })}
      onClick={(e) => {
        e.preventDefault()
        return isPlaying ? handlePause() : handlePlay()
      }}
    >
      {isPlayingForType && isPlaying ? (
        <PauseIcon className={iconStyles} />
      ) : (
        <PlayIcon className={iconStyles} />
      )}
    </button>
  )
}
