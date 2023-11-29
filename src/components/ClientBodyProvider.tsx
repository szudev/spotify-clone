'use client'

import { cn } from '@/lib/utils'
import useScrollStore from '@/store/main-view-scroll'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'
import { shuffle } from 'lodash'
import { ListofColors } from '@/lib/background-colors'
import useBgColor from '@/hooks/use-bg-color'

export default function ClientBodyProvider({
  children
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { setScrollState } = useScrollStore()
  const mainRef = useRef<HTMLDivElement>(null)
  const { backgroundColorValue, backgroundColorSetter } = useBgColor()

  useEffect(() => {
    if (!mainRef.current) return
    const handleScroll = () => {
      if (!mainRef.current) return
      if (mainRef.current.scrollTop === 0) {
        setScrollState({ still: true })
      } else if (
        mainRef.current.scrollTop > 0 &&
        mainRef.current.scrollTop < 50
      ) {
        setScrollState({ scrolling: true })
      } else if (mainRef.current.scrollTop >= 50) {
        setScrollState({ scrolled: true })
      }
    }

    // Attach the event listener to the main element

    mainRef.current.addEventListener('scroll', handleScroll)

    // Clean up the event listener on component unmount
    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    backgroundColorSetter(shuffle(ListofColors).pop())
  }, [pathname])

  return (
    <main
      ref={mainRef}
      className={cn('overflow-y-auto flex-1 to-zinc-900 bg-gradient-to-b', {
        [backgroundColorValue ? backgroundColorValue : 'from-[#222222]']:
          pathname.startsWith('/playlist')
      })}
    >
      {children}
    </main>
  )
}
