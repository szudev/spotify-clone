import AsideMenuItem from './AsideMenuItem'
import { HomeIcon, LibraryIcon, PlusIcon, SearchIcon } from './Icons'
import { Suspense } from 'react'
import { AsideUserPlaylistSkeleton } from './ui/Skeletons'
import UserPlaylistsStream from './UserPlaylistsStream'

export default async function AsideMenu() {
  return (
    <nav className='flex flex-col gap-2 overflow-y-auto flex-1'>
      <div className='bg-zinc-900 rounded-lg p-2'>
        <ul className='flex flex-col gap-5 p-4'>
          <AsideMenuItem href='/'>
            <HomeIcon className='h-6 w-6' />
            Home
          </AsideMenuItem>
          <AsideMenuItem href='#'>
            <SearchIcon className='h-6 w-6' />
            Search
          </AsideMenuItem>
        </ul>
      </div>
      <div className='bg-zinc-900 rounded-lg p-2 flex-1 overflow-y-auto'>
        <div className='flex flex-col overflow-y-auto flex-1'>
          <ul className='flex justify-between items-center p-4'>
            <AsideMenuItem href='#'>
              <LibraryIcon className='h-6 w-6' />
              Your Library
            </AsideMenuItem>
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
