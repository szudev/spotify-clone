'use client'

import { ReactNode, useCallback, useState } from 'react'
import { Button } from './Button'
import { BackArrowIcon, ForwardArrowIcon, SearchIcon } from './Icons'
import { cn } from '@/lib/utils'
import useScrollBehaviour from '@/hooks/use-scroll-behaviour'
import useBgColor from '@/hooks/use-bg-color'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { headerTitleState } from '@/store/atoms/header-title-atom'
import { scrollBehaviourState } from '@/store/atoms/main-scroll-atom'
import { X } from 'lucide-react'
import debounce from 'lodash/debounce'

export default function ClientHeaderProvider({
  children
}: {
  children: ReactNode
}) {
  const { scrollBehaviourValue } = useScrollBehaviour()
  const { backgroundColorValue } = useBgColor()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const headerTitle = useAtomValue(headerTitleState)
  const scrollState = useAtomValue(scrollBehaviourState)
  const [input, SetInput] = useState<string>('')

  const searchRequest = debounce((queryParam: string) => {
    if (queryParam === '') return
    router.push(`?q=${queryParam.toLowerCase()}`)
  }, 500)

  const debounceSearchRequests = useCallback((queryParam: string) => {
    searchRequest(queryParam)
  }, [])

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
      <div className='flex items-center w-full h-full justify-start gap-2 overflow-x-hidden'>
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
        {pathname.startsWith('/search') &&
        (!searchParams.has('q') || searchParams.get('q') === '') ? (
          <div className='h-full flex items-center py-2 w-full'>
            <div className='rounded-full h-full items-center bg-[#2A2A2A] px-3 flex lg:w-1/2 md:w-[85%] hover:[outline:1px_solid_rgba(255,255,255,.15)] focus-within:outline-white focus-within:outline focus-within:hover:outline-white focus-within:outline-2 focus-within:hover:outline focus-within:hover:outline-2'>
              <SearchIcon className='w-5 h-5 text-white' />
              <input
                className='flex text-sm text-white w-full px-2 flex-1 h-full bg-transparent py-3 rounded-full outline-none'
                placeholder='What do you want to listen to?'
                value={input}
                onChange={(text) => {
                  SetInput(text.currentTarget.value)
                  debounceSearchRequests(text.currentTarget.value)
                }}
              />
              <X className='text-white w-5 h-5' />
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </header>
  )
}
