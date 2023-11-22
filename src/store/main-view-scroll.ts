/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface ScrollStore {
  isStill: boolean
  isScrolling: boolean
  isScrolled: boolean
  setScrollState: ({
    still,
    scrolling,
    scrolled
  }: {
    still?: boolean
    scrolling?: boolean
    scrolled?: boolean
  }) => void
}

const useScrollStore = create<ScrollStore>((set) => ({
  isStill: true,
  isScrolling: false,
  isScrolled: false,
  setScrollState: ({ still, scrolling, scrolled }) =>
    set({
      isStill: still ?? false,
      isScrolled: scrolled ?? false,
      isScrolling: scrolling ?? false
    })
}))

export default useScrollStore
