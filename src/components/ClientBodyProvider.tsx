'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'
import { shuffle } from 'lodash'
import { ListofColors } from '@/lib/background-colors'
import useBgColor from '@/hooks/use-bg-color'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'

export default function ClientBodyProvider({
  children
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const mainRef = useRef<HTMLDivElement>(null)
  const { backgroundColorValue, backgroundColorSetter } = useBgColor()
  const { scrollSetter } = useScrollBehaviour()

  useEffect(() => {
    if (!mainRef.current) return
    const handleScroll = () => {
      if (!mainRef.current) return
      if (mainRef.current.scrollTop === 0) {
        scrollSetter({ still: true })
      } else if (
        mainRef.current.scrollTop > 0 &&
        mainRef.current.scrollTop < 50
      ) {
        scrollSetter({ scrolling: true })
      } else if (mainRef.current.scrollTop >= 50) {
        scrollSetter({ scrolled: true })
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
  }, [scrollSetter])

  useEffect(() => {
    if (pathname.endsWith('/') || pathname.startsWith('/genre')) {
      backgroundColorSetter('bg-[#222222] from-[#222222]')
    }
    if (pathname.startsWith('/playlist')) {
      backgroundColorSetter(shuffle(ListofColors).pop())
    }
  }, [pathname, backgroundColorSetter])

  return (
    <main
      ref={mainRef}
      className={cn(
        'overflow-y-auto flex-1 to-zinc-900 rounded-none md:rounded-lg bg-gradient-to-b',
        {
          [backgroundColorValue ? backgroundColorValue : 'from-[#222222]']:
            pathname.startsWith('/playlist')
        }
      )}
    >
      {children}
    </main>
  )
}
