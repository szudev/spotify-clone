'use client'

import useScrollStore from '@/store/main-view-scroll'
import { ReactNode, useEffect, useRef } from 'react'

export default function ClientBodyProvider({
  children
}: {
  children: ReactNode
}) {
  const { setScrollState } = useScrollStore()
  const mainRef = useRef<HTMLDivElement>(null)

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

  return (
    <main ref={mainRef} className='bg-transparent overflow-y-auto flex-1'>
      {children}
    </main>
  )
}
