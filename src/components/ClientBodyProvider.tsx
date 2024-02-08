'use client'

import { cn, getCurrentYear } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'
import { shuffle } from 'lodash'
import { ListofColors } from '@/lib/background-colors'
import useBgColor from '@/hooks/use-bg-color'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'
import { useAtomValue, useSetAtom } from 'jotai'
import { currentTrackAtom } from '@/store/atoms/player-atom'
import { navigationRouteAtom } from '@/store/atoms/navigation.atom'

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
  const setNavigation = useSetAtom(navigationRouteAtom)

  useEffect(() => {
    if (!mainRef.current) return
    const refConst = mainRef.current
    const handleScroll = () => {
      if (!refConst) return
      if (refConst.scrollTop === 0) {
        scrollSetter({ still: true })
      } else if (refConst.scrollTop > 0 && refConst.scrollTop < 50) {
        scrollSetter({ scrolling: true })
      } else if (refConst.scrollTop >= 50) {
        scrollSetter({ scrolled: true })
      }
    }

    // Attach the event listener to the main element

    refConst.addEventListener('scroll', handleScroll)

    // Clean up the event listener on component unmount
    return () => {
      if (refConst) {
        refConst.removeEventListener('scroll', handleScroll)
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
    if (
      pathname.startsWith('/playlist/') ||
      pathname.startsWith('/album/') ||
      pathname.startsWith('/artist/')
    ) {
      backgroundColorSetter(shuffle(ListofColors).pop())
    }
  }, [pathname, backgroundColorSetter])

  useEffect(() => {
    if (pathname === '/') setNavigation('home')
    else if (
      pathname.endsWith('albums') ||
      pathname.endsWith('playlists') ||
      pathname.endsWith('myAlbums')
    )
      setNavigation('library')
    else if (
      pathname.startsWith('/search') ||
      pathname.startsWith('/genre/playlists') ||
      pathname.startsWith('/genre/albums')
    )
      setNavigation('search')
  }, [pathname, setNavigation])

  return (
    <main
      ref={mainRef}
      className={cn(
        'overflow-y-auto flex flex-col flex-1 to-zinc-900 rounded-none md:rounded-lg bg-gradient-to-b',
        {
          [backgroundColorValue ? backgroundColorValue : 'from-[#222222]']:
            pathname.startsWith('/playlist/') ||
            pathname.startsWith('/album/') ||
            pathname.startsWith('/artist/')
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
          <p>© {getCurrentYear()} Fake-Spotify</p>
        </div>
      </section>
    </main>
  )
}
