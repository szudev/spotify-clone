'use client'

import { HomeIcon } from 'lucide-react'
import { LibraryIcon, SearchIcon } from './Icons'
import AsideMenuItem from './AsideMenuItem'
import { usePathname } from 'next/navigation'

export default function MobileMenu() {
  const pathname = usePathname()
  return (
    <section className='flex justify-evenly items-center md:hidden'>
      <AsideMenuItem
        href='/'
        className='text-white flex flex-col gap-0 font-normal text-sm'
      >
        <HomeIcon
          className={`${pathname === '/' ? 'fill-white' : 'fill-none'} h-6 w-6`}
        />
        Home
      </AsideMenuItem>
      <AsideMenuItem
        href='/'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        <SearchIcon className='h-6 w-6' />
        Search
      </AsideMenuItem>
      <AsideMenuItem
        href='/'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        <LibraryIcon
          className={`${
            pathname.startsWith('/search')
              ? 'fill-white'
              : 'stroke-2 stroke-white fill-none'
          } h-6 w-6 `}
        />
        Library
      </AsideMenuItem>
    </section>
  )
}
