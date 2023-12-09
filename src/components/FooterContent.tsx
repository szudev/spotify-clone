import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import MainPlayer from './MainPlayer'
import { getUserPlaybackState } from '@/services/playback'
import AsideMenuItem from './AsideMenuItem'
import { HomeIcon, LibraryIcon, SearchIcon } from './Icons'

export default async function FooterContent() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode } = await getUserPlaybackState(spotifyApi)

  return (
    <section className='flex flex-col gap-2 md:gap-0 px-2 md:pb-[2px] pb-2 pt-2 rounded-lg'>
      <MainPlayer
        accessToken={spotifyApi.getAccessToken()}
        body={body}
        statusCode={statusCode}
      />
      <section className='flex justify-evenly items-center md:hidden'>
        <AsideMenuItem
          href='/'
          className='text-white flex flex-col gap-0 font-normal text-sm'
        >
          <HomeIcon className='h-6 w-6' />
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
          <LibraryIcon className='h-6 w-6' />
          Library
        </AsideMenuItem>
      </section>
    </section>
  )
}
