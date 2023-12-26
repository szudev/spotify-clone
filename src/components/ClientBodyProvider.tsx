'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'
import { shuffle } from 'lodash'
import { ListofColors } from '@/lib/background-colors'
import useBgColor from '@/hooks/use-bg-color'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'
import { useAtomValue } from 'jotai'
import { currentTrackAtom } from '@/store/atoms/player-atom'

export default function ClientBodyProvider({
  children
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const currentTrack = useAtomValue(currentTrackAtom)
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
    if (pathname.endsWith('search')) {
      backgroundColorSetter('bg-zinc-900')
    }
    if (pathname.endsWith('/') || pathname.startsWith('/genre')) {
      backgroundColorSetter('bg-[#222222] from-[#222222]')
    }
    if (pathname.startsWith('/playlist/') || pathname.startsWith('/album/')) {
      backgroundColorSetter(shuffle(ListofColors).pop())
    }
  }, [pathname, backgroundColorSetter])

  return (
    <main
      ref={mainRef}
      className={cn(
        'overflow-y-auto flex flex-col flex-1 to-zinc-900 rounded-none md:rounded-lg bg-gradient-to-b',
        {
          [backgroundColorValue ? backgroundColorValue : 'from-[#222222]']:
            pathname.startsWith('/playlist/') || pathname.startsWith('/album/')
        }
      )}
    >
      {children}
      <section
        className={cn('md:py-8 pt-8 pb-16 bg-zinc-900 md:px-6 px-4', {
          'pb-32': currentTrack
        })}
      >
        <div className='[border-top:1px_solid_rgba(255,255,255,.15)] gap-4 pt-8 text-sm text-zinc-400 flex items-center flex-wrap md:justify-between justify-center'>
          <div className='md:flex md:flex-wrap grid grid-cols-3 md:gap-4 gap-2 text-center items-center justify-center'>
            <p className='cursor-pointer hover:text-white'>Legal</p>
            <p className='cursor-pointer hover:text-white'>Privacy Center</p>
            <p className='cursor-pointer hover:text-white'>Privacy Police</p>
            <p className='cursor-pointer hover:text-white'>Cookies</p>
            <p className='cursor-pointer hover:text-white'>About Ads</p>
            <p className='cursor-pointer hover:text-white'>Accessibility</p>
          </div>
          <p>© 2023 Fake-Spotify</p>
        </div>
      </section>
    </main>
  )
}
