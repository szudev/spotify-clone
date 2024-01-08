'use client'

import { useAtomValue } from 'jotai'
import AsideMenuItem from './AsideMenuItem'
import { HomeFocusIcon, HomeIcon, SearchActiveIcon, SearchIcon } from './Icons'
import { navigationRouteAtom } from '@/store/atoms/navigation.atom'

export default function AsideMenuClientLinks() {
  const navigationValue = useAtomValue(navigationRouteAtom)
  return (
    <ul className='flex flex-col gap-5 p-4'>
      <AsideMenuItem href='/'>
        {navigationValue === 'home' ? (
          <HomeFocusIcon className='h-6 w-6 text-white' />
        ) : (
          <HomeIcon className='h-6 w-6' />
        )}
        Home
      </AsideMenuItem>
      <AsideMenuItem href='/search'>
        {navigationValue === 'search' ? (
          <SearchActiveIcon className='h-6 w-6 text-white' />
        ) : (
          <SearchIcon className='h-6 w-6' />
        )}
        Search
      </AsideMenuItem>
    </ul>
  )
}
