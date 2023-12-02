import { atom } from 'jotai'

interface TPlaylistIdState {
  key: string
  default: string | null
}

interface TPlaylistState {
  key: string
  default: string | null
}

export const playlistIdState = atom<TPlaylistIdState>({
  key: 'playlistIdState',
  default: null
})

export const playlistState = atom<TPlaylistState>({
  key: 'playlistAtomState',
  default: null
})
