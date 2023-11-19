import AsideMenuItem from './AsideMenuItem'
import { HomeIcon, LibraryIcon, PlusIcon, SearchIcon } from './Icons'

export default function AsideMenu() {
  return (
    <nav className='flex flex-col gap-2 flex-1'>
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
      <div className='bg-zinc-900 rounded-lg p-2 flex-1'>
        <ul className='flex flex-col gap-5 p-4'>
          <div className='flex justify-between items-center'>
            <AsideMenuItem href='#'>
              <LibraryIcon className='h-6 w-6' />
              Your Library
            </AsideMenuItem>
            <button className='group rounded-full p-2 bg-hover-effect'>
              <span className='text-zinc-400 group-hover:text-zinc-100'>
                <PlusIcon className='h-4 w-4' />
              </span>
            </button>
          </div>
        </ul>
      </div>
    </nav>
  )
}
