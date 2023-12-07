import { atom } from 'jotai'

export const currentTrackAtom = atom<
  | {
      song: SpotifyApi.TrackObjectFull | null
      progress_ms: number | null
    }
  | undefined
>(undefined)
export const volumeAtom = atom<number>(50)
export const isPlayingAtom = atom<boolean>(false)
export const playerSdkAtom = atom<Spotify.Player | undefined>(undefined)
export const deviceIdAtom = atom<string | undefined>(undefined)
