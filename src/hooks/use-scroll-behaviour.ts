import {
  scrollBehaviourState,
  scrollBehaviourSetter
} from '@/store/atoms/main-scroll-atom'
import { useAtomValue, useAtom } from 'jotai'

export default function useScrollBehaviour() {
  const scrollBehaviourValue = useAtomValue(scrollBehaviourState)
  const [, scrollSetter] = useAtom(scrollBehaviourSetter)

  return { scrollBehaviourValue, scrollSetter }
}
