'use client'

import { ReactNode } from 'react'
import { Button } from './Button'
import { BackArrowIcon, ForwardArrowIcon } from './Icons'
import useScrollStore from '@/store/main-view-scroll'
import { cn } from '@/lib/utils'

export default function ClientHeaderProvider({
  children
}: {
  children: ReactNode
}) {
  const { isScrolled, isScrolling, isStill } = useScrollStore()
  return (
    <header
      className={cn(
        'hidden md:flex md:w-full h-16 md:absolute top-0 justify-between items-center px-6 transition-all duration-300',
        {
          'bg-transparent': !isStill,
          'bg-zinc-900 bg-opacity-20': isScrolling,
          'bg-zinc-900': isScrolled
        }
      )}
    >
      <div className='flex items-center justify-center gap-2'>
        <Button className='rounded-full bg-hover-effect p-2 text-zinc-400 hover:text-zinc-100'>
          <BackArrowIcon className='h-4 w-4' />
        </Button>
        <Button className='rounded-full bg-hover-effect p-2 text-zinc-400 hover:text-zinc-100'>
          <ForwardArrowIcon className='h-4 w-4' />
        </Button>
      </div>
      {children}
    </header>
  )
}
