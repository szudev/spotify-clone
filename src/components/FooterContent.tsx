import Image from 'next/image'
import { HeartIcon, HighVolumeIcon } from './Icons'
import { Slider } from './ui/slider'
import Link from 'next/link'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import MainPlayer from './MainPlayer'

export default async function FooterContent() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  /* const { body, statusCode } = await spotifyApi.getMyCurrentPlaybackState()

  if(statusCode === 204) {
    //FILL WITH THE DEFAULT STATE
  }
  if(statusCode === 200) {
    //FILL WITH THE PLAYBACK STATUS
    //CHECK IF THE PLAYBACK IS PLAYING SO WE CAN PAUSE IT IF SO
  } */

  return (
    <section className='grid grid-cols-[30%_40%_30%] px-2 pb-[2px] pt-2 rounded-lg'>
      <div className='flex justify-start items-center gap-3'>
        <Image
          src={'/404-img.png'}
          className='aspect-square'
          height={56}
          width={56}
          alt='Test-player-img'
        />
        <div className='flex flex-col'>
          <Link href={'#'} className='text-white text-sm hover:underline'>
            Advanced - Short Mix
          </Link>
          <p className='text-zinc-400 text-[11px]'>Marcel Woods</p>
        </div>
        <HeartIcon className='h-4 w-4 fill-zinc-400' />
      </div>
      <MainPlayer accessToken={spotifyApi.getAccessToken()} />
      <div className='flex items-center justify-end gap-2'>
        <HighVolumeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
        <div className='w-full flex relative flex-col max-w-[50%] group'>
          <p className='invisible text-xs'>Hidden Text</p>
          <Slider
            defaultValue={[100]}
            max={100}
            min={0}
            step={1}
            className='top-1/2 left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
          />
        </div>
      </div>
    </section>
  )
}
