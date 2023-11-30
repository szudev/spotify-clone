'use client'

import { ReactNode, useEffect } from 'react'
import { Button } from './Button'
import { BackArrowIcon, ForwardArrowIcon } from './Icons'
import { cn } from '@/lib/utils'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'
import useBgColor from '@/hooks/use-bg-color'

export default function ClientHeaderProvider({
  children
}: {
  children: ReactNode
}) {
  const { scrollBehaviourValue } = useScrollBehaviour()
  const { backgroundColorValue } = useBgColor()

  return (
    <header
      className={cn(
        'hidden z-[999] md:flex md:w-full h-16 md:absolute top-0 justify-between items-center px-6 transition-all duration-300',
        {
          'bg-transparent': !scrollBehaviourValue.isStill,
          [`${backgroundColorValue} bg-opacity-40`]:
            scrollBehaviourValue.isScrolling,
          [`${backgroundColorValue}`]: scrollBehaviourValue.isScrolled
        }
      )}
    >
      <div className='flex items-center justify-center gap-2'>
        <Button className='rounded-full bg-[#171717] p-2 text-zinc-400 hover:text-zinc-100'>
          <BackArrowIcon className='h-4 w-4' />
        </Button>
        <Button className='rounded-full bg-[#171717] p-2 text-zinc-400 hover:text-zinc-100'>
          <ForwardArrowIcon className='h-4 w-4' />
        </Button>
      </div>
      {children}
    </header>
  )
}
