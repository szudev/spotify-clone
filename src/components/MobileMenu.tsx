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
import { useAtomValue } from 'jotai'
import { navigationRouteAtom } from '@/store/atoms/navigation.atom'

export default function MobileMenu() {
  const navigationValue = useAtomValue(navigationRouteAtom)
  return (
    <section className='flex justify-evenly items-center md:hidden'>
      <AsideMenuItem
        href='/'
        className='text-white flex flex-col gap-0 font-normal text-sm'
      >
        {navigationValue === 'home' ? (
          <HomeFocusIcon className='h-6 w-6 text-white' />
        ) : (
          <HomeIcon className='h-6 w-6' />
        )}
        Home
      </AsideMenuItem>
      <AsideMenuItem
        href='/search'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        {navigationValue === 'search' ? (
          <SearchActiveIcon className='h-6 w-6 text-white' />
        ) : (
          <SearchIcon className='h-6 w-6' />
        )}
        Search
      </AsideMenuItem>
      <AsideMenuItem
        href='/'
        className='text-white flex-col gap-0 font-normal text-sm'
      >
        {navigationValue === 'library' ? (
          <LibraryActiveIcon className='text-white h-6 w-6' />
        ) : (
          <LibraryIcon className='h-6 w-6' />
        )}
        Library
      </AsideMenuItem>
    </section>
  )
}
