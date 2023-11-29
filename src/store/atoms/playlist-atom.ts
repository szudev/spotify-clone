import { atom } from 'jotai'

interface TPlaylistIdState {
  key: string
  default: string
}

interface TPlaylistState {
  key: string
  default: string | null
}

export const playlistIdState = atom<TPlaylistIdState>({
  key: 'playlistIdState',
  default: ''
})

export const playlistState = atom<TPlaylistState>({
  key: 'playlistAtomState',
  default: null
})
