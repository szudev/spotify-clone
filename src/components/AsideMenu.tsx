import { PlusIcon } from './Icons'
import { Suspense } from 'react'
import {
  AsideMenuLibraryLinkSkeleton,
  AsideMenuLinksSkeleton,
  AsideUserPlaylistSkeleton
} from './ui/Skeletons'
import UserPlaylistsStream from './UserPlaylistsStream'
import dynamic from 'next/dynamic'

export default async function AsideMenu() {
  const AsideMenuClientLinks = dynamic(
    () => import('@/components/AsideMenuClientLinks'),
    {
      ssr: false,
      loading: () => <AsideMenuLinksSkeleton />
    }
  )
  const AsideMenuClientLibraryLink = dynamic(
    () => import('@/components/AsideMenuClientLibraryLink'),
    {
      ssr: false,
      loading: () => <AsideMenuLibraryLinkSkeleton />
    }
  )
  return (
    <nav className='flex flex-col gap-2 overflow-y-auto flex-1'>
      <div className='bg-zinc-900 rounded-lg p-2'>
        <AsideMenuClientLinks />
      </div>
      <div className='bg-zinc-900 rounded-lg p-2 flex-1 overflow-y-auto'>
        <div className='flex flex-col overflow-y-auto flex-1'>
          <ul className='flex justify-between items-center p-4'>
            <AsideMenuClientLibraryLink />
            <button className='group rounded-full p-2 bg-hover-effect'>
              <span className='text-zinc-400 group-hover:text-zinc-100'>
                <PlusIcon className='h-4 w-4' />
              </span>
            </button>
          </ul>
          <Suspense fallback={<AsideUserPlaylistSkeleton />}>
            <UserPlaylistsStream />
          </Suspense>
        </div>
      </div>
    </nav>
  )
}
