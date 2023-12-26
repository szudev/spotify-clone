'use client'

import {
  HomeFocusIcon,
  HomeIcon,
  LibraryActiveIcon,
  LibraryIcon,
  SearchActiveIcon,
  SearchIcon
} from './Icons'
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
        {pathname === '/' ? (
          <HomeFocusIcon className='h-6 w-6' />
        ) : (
          <HomeIcon className='h-6 w-6' />
        )}
        Home
      </AsideMenuItem>
      <AsideMenuItem
        href='/search'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        {pathname.startsWith('/search') ? (
          <SearchActiveIcon className='h-6 w-6' />
        ) : (
          <SearchIcon className='h-6 w-6' />
        )}
        Search
      </AsideMenuItem>
      <AsideMenuItem
        href='/'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        {pathname.startsWith('/library/') ? (
          <LibraryActiveIcon className='h-6 w-6' />
        ) : (
          <LibraryIcon className='h-6 w-6' />
        )}
        Library
      </AsideMenuItem>
    </section>
  )
}
