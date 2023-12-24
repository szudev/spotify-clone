import { AlbumTrackMergeType } from '@/types/spotify-web-api-node'
import { atom } from 'jotai'

export const currentTrackAtom = atom<
  | {
      song: SpotifyApi.TrackObjectFull | AlbumTrackMergeType | null
      progress_ms: number | null
      tracks: (SpotifyApi.TrackObjectFull | AlbumTrackMergeType | null)[]
    }
  | undefined
>(undefined)
export const volumeAtom = atom<number>(50)
export const isPlayingAtom = atom<boolean>(false)
export const playerSdkAtom = atom<Spotify.Player | undefined>(undefined)
export const deviceIdAtom = atom<string | undefined>(undefined)
