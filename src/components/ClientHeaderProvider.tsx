'use client'

import { ReactNode } from 'react'
import { Button } from './Button'
import { BackArrowIcon, ForwardArrowIcon } from './Icons'
import { cn } from '@/lib/utils'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'
import useBgColor from '@/hooks/use-bg-color'
import { usePathname, useRouter } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { headerTitleState } from '@/store/atoms/header-title-atom'
import { scrollBehaviourState } from '@/store/atoms/main-scroll-atom'

export default function ClientHeaderProvider({
  children
}: {
  children: ReactNode
}) {
  const { scrollBehaviourValue } = useScrollBehaviour()
  const { backgroundColorValue } = useBgColor()
  const pathname = usePathname()
  const router = useRouter()
  const headerTitle = useAtomValue(headerTitleState)
  const scrollState = useAtomValue(scrollBehaviourState)

  return (
    <header
      className={cn(
        'hidden z-[998] md:flex rounded-t-lg gap-2 md:w-full h-16 md:absolute top-0 justify-between items-center px-6 transition-all duration-300',
        {
          'bg-transparent': !scrollBehaviourValue.isStill,
          [`${backgroundColorValue} bg-opacity-40`]:
            scrollBehaviourValue.isScrolling,
          [`${backgroundColorValue}`]: scrollBehaviourValue.isScrolled
        }
      )}
    >
      <div className='flex items-center justify-center gap-2 overflow-x-hidden rounded-t-lg'>
        <Button
          onClick={() => router.back()}
          className={`rounded-full bg-[#171717] p-2 text-zinc-400 hover:text-zinc-100`}
        >
          <BackArrowIcon className='h-4 w-4' />
        </Button>
        <Button
          onClick={() => router.forward()}
          className='rounded-full bg-[#171717] p-2 text-zinc-400 hover:text-zinc-100'
        >
          <ForwardArrowIcon className='h-4 w-4' />
        </Button>
        {(pathname.startsWith('/playlist/') ||
          pathname.startsWith('/album/')) &&
        headerTitle &&
        scrollState.isScrolled ? (
          <strong className='text-white md:text-2xl text-xl truncate'>
            {headerTitle}
          </strong>
        ) : null}
      </div>
      {children}
    </header>
  )
}
