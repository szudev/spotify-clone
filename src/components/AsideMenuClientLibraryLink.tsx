'use client'

import { navigationRouteAtom } from '@/store/atoms/navigation.atom'
import { useAtomValue } from 'jotai'
import AsideMenuItem from './AsideMenuItem'
import { LibraryActiveIcon, LibraryIcon } from './Icons'

export default function AsideMenuClientLibraryLink() {
  const navigationValue = useAtomValue(navigationRouteAtom)
  return (
    <AsideMenuItem href='#'>
      {navigationValue === 'library' ? (
        <LibraryActiveIcon className='text-white h-6 w-6' />
      ) : (
        <LibraryIcon className='h-6 w-6' />
      )}
      Your Library
    </AsideMenuItem>
  )
}
