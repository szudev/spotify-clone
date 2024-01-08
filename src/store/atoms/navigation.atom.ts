import { atom } from 'jotai'

export const navigationRouteAtom = atom<
  'home' | 'search' | 'library' | undefined
>(undefined)
