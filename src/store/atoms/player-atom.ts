import { atom } from 'jotai'

export const currentTrackAtom = atom<SpotifyApi.TrackObjectFull | undefined>(
  undefined
)
export const isPlayingAtom = atom<boolean>(false)
export const playerSdkAtom = atom<Spotify.Player | undefined>(undefined)
export const deviceIdAtom = atom<string | undefined>(undefined)
