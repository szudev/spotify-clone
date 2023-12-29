import Image from 'next/image'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon, PlayIcon } from './Icons'
import Link from 'next/link'
import { getUserSavedAlbums } from '@/services/album'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

interface Props {
  spotifyApi: SpotifyWebApi
}

export default async function RecentlyPlayed({ spotifyApi }: Props) {
  const { body: savedAlbums, statusCode } = await getUserSavedAlbums({
    spotifyApi
  })

  if (statusCode === 401) return redirect('/login')

  const GreetingTime = dynamic(() => import('@/components/GreetingTime'), {
    ssr: false,
    loading: () => (
      <div className='flex items-center w-full'>
        <div className='h-6 w-[20%] rounded-full bg-zinc-500 animate-pulse' />
      </div>
    )
  })

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex items-center'>
        <GreetingTime />
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Link
            href={'/genre/myAlbums'}
            className='text-white text-xl font-semibold'
          >
            Albums
          </Link>
          {savedAlbums?.next ? (
            <Link
              href={'/genre/myAlbums'}
              className='text-zinc-400 text-sm hover:underline'
            >
              Show all
            </Link>
          ) : null}
        </div>
        {savedAlbums && (
          <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2'>
            {savedAlbums.items.map((album) => (
              <Link
                key={album.album.id}
                href={`/album/${album.album.id}`}
                className='md:bg-hover-effect grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 group md:gap-4 gap-2 bg-transparent md:bg-black/30 rounded-md'
              >
                <div className='relative rounded-md'>
                  <Image
                    src={album.album.images[0].url}
                    height={album.album.images[0].height}
                    width={album.album.images[0].width}
                    className='rounded-l-md md:rounded-md aspect-square'
                    alt={album.album.name}
                    priority
                  />
                  <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'>
                    {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                    <PauseIcon className='h-1/2 w-1/2' />
                  </div>
                </div>
                <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
                  <strong className='text-white text-xs block md:text-xl truncate'>
                    {album.album.name}
                  </strong>
                  <p className='text-zinc-400 md:inline hidden text-sm truncate'>
                    {album.album.artists
                      .map((artist) => artist.name)
                      .join(', ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
