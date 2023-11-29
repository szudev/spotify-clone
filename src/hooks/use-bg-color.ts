import { backgroundColorState } from '@/store/atoms/bg-color-atom'
import { useAtomValue, useSetAtom } from 'jotai'

export default function useBgColor() {
  const backgroundColorValue = useAtomValue(backgroundColorState)
  const backgroundColorSetter = useSetAtom(backgroundColorState)
  return { backgroundColorValue, backgroundColorSetter }
}
