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
      <div className='flex flex-col items-center justify-between'>
        <MainPlayer accessToken={spotifyApi.getAccessToken()} />
        <div className='grid w-full grid-cols-[minmax(20px,auto)_1fr_minmax(20px,auto)] gap-2 items-center justify-center'>
          <div className='flex justify-end items-center text-zinc-400 text-sm'>
            0:00
          </div>
          <div className='w-full flex relative flex-col group'>
            <p className='invisible text-xs'>Hidden Text</p>
            <Slider
              defaultValue={[0]}
              max={100}
              min={0}
              step={1}
              className='top-1/2 group left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
            />
          </div>
          <div className='flex justify-start items-center text-zinc-400 text-sm'>
            0:00
          </div>
        </div>
      </div>
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
