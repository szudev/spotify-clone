import { atom } from 'jotai'

export const currentTrackIdAtom = atom<string | undefined>(undefined)
export const isPlayingAtom = atom<boolean>(false)
