/* eslint-disable no-unused-vars */
import { Getter, Setter, atom } from 'jotai'

interface ScrollStore {
  isStill: boolean
  isScrolling: boolean
  isScrolled: boolean
  setScrollState: (newState: {
    still?: boolean
    scrolling?: boolean
    scrolled?: boolean
  }) => void
}

export const backgroundColorState = atom({
  isStill: true,
  isScrolling: false,
  isScrolled: false,
  set: (
    get: Getter,
    set: Setter,
    {
      still,
      scrolling,
      scrolled
    }: {
      still?: boolean
      scrolling?: boolean
      scrolled?: boolean
    }
  ) =>
    set(backgroundColorState, {
      isScrolled: scrolled ?? get(backgroundColorState).isScrolled,
      isScrolling: scrolling ?? get(backgroundColorState).isScrolling,
      isStill: still ?? get(backgroundColorState).isStill,
      set: () => {}
    })
})
