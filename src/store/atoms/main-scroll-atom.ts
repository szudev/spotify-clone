/* eslint-disable no-unused-vars */
import { Getter, Setter, atom } from 'jotai'

interface IScrollBehaviourState {
  isStill: boolean
  isScrolling: boolean
  isScrolled: boolean
}

export const scrollBehaviourState = atom<IScrollBehaviourState>({
  isStill: true,
  isScrolling: false,
  isScrolled: false
})

export const scrollBehaviourSetter = atom(
  () => '',
  (
    get: Getter,
    set: Setter,
    {
      still,
      scrolling,
      scrolled
    }: { still?: boolean; scrolling?: boolean; scrolled?: boolean }
  ) =>
    set(scrollBehaviourState, {
      isScrolled: scrolled ?? false,
      isScrolling: scrolling ?? false,
      isStill: still ?? false
    })
)
