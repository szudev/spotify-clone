import { AlbumTrackMergeType } from '@/types/spotify-web-api-node'
import { atom } from 'jotai'

export const currentTrackAtom = atom<
  | {
      song: SpotifyApi.TrackObjectFull | AlbumTrackMergeType | null
      progress_ms: number | null
      tracks: (SpotifyApi.TrackObjectFull | AlbumTrackMergeType | null)[]
      playlistId?: string
      albumId?: string
      artistId?: string
      songObject?: SpotifyApi.TrackObjectFull
    }
  | undefined
>(undefined)
export const volumeAtom = atom<number>(50)
export const isPlayingAtom = atom<boolean>(false)
export const playerSdkAtom = atom<Spotify.Player | undefined>(undefined)
export const deviceIdAtom = atom<string | undefined>(undefined)
type PlayerErrorType =
  | 'authentication_error'
  | 'account_error'
  | 'initialization_error'
  | 'playback_error'
export const errorDescriptions: Record<PlayerErrorType, string> = {
  authentication_error: 'Failed to instantiate a valid Spotify connection.',
  account_error: 'A Spotify premium account is required.',
  initialization_error:
    'The player was not able to instantiate a player capable of playing content in the current environment (Browser EME protection).',
  playback_error: 'Failed to load or play the current track(s).'
}
type PlayerErrorState =
  | {
      errorType: PlayerErrorType
      description: string
    }
  | undefined
export const playerErrorAtom = atom<PlayerErrorState>(undefined)
