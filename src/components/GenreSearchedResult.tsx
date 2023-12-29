import { SearchResults } from '@/services/search'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon } from './Icons'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
}

export default async function GenreSearchedResult({
  queryParam,
  spotifyApi
}: Props) {
  const { body, statusCode } = await SearchResults({
    queryParam,
    spotifyApi
  })
  if (statusCode !== 200) return notFound()

  return (
    <section className='flex flex-col flex-1'>
      <div className='flex justify-start items-end py-7 break-all'>
        <h1
          className={cn('text-white font-black capitalize', {
            'md:text-[6rem] text-5xl': queryParam.length <= 10,
            'md:text-7xl text-3xl': queryParam.length > 10
          })}
        >
          {queryParam}
        </h1>
      </div>
      <div className='pt-7 w-full flex flex-col gap-7 flex-1'>
        {body && body.playlists && body.playlists.total > 0 ? (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center w-full justify-between'>
              <h2 className='text-2xl text-white font-bold'>Playlists</h2>
              {body.playlists.next ? (
                <Link
                  href={`/genre/playlists/${queryParam}`}
                  className='text-zinc-400 text-sm hover:underline hover:cursor-pointer'
                >
                  Show All
                </Link>
              ) : null}
            </div>
            <div className='grid md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-cols-1 gap-3'>
              {body.playlists.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/playlist/${item.id}`}
                  className='md:bg-hover-effect grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 group md:gap-4 gap-2 bg-transparent md:bg-black/30 rounded-md'
                >
                  <div className='relative rounded-md'>
                    <Image
                      src={item.images[0].url}
                      width={56}
                      height={56}
                      className='rounded-md aspect-square w-full h-auto'
                      alt={item.name}
                      priority
                      sizes='(min-width: 1120px) calc(20vw - 106px), (min-width: 960px) calc(25vw - 121px), (min-width: 800px) calc(33.57vw - 150px), calc(25.83vw - 11px)'
                    />
                    <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'>
                      {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                      <PauseIcon className='h-1/2 w-1/2' />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
                    <strong className='text-white text-base block truncate'>
                      {item.name}
                    </strong>
                    <p className='text-zinc-400 text-sm truncate'>
                      {item.owner.display_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {body && body.albums && body.albums.total > 0 ? (
          <div className='flex flex-col gap-3'>
            <div className='flex items-center w-full justify-between'>
              <h2 className='text-2xl text-white font-bold'>Albums</h2>
              {body.albums.next ? (
                <Link
                  href={`/genre/albums/${queryParam}`}
                  className='text-zinc-400 text-sm hover:underline hover:cursor-pointer'
                >
                  Show All
                </Link>
              ) : null}
            </div>
            <div className='grid md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-cols-1 gap-3'>
              {body.albums.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/album/${item.id}`}
                  className='md:bg-hover-effect grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 group md:gap-4 gap-2 bg-transparent md:bg-black/30 rounded-md'
                >
                  <div className='relative rounded-md'>
                    <Image
                      src={item.images[0].url}
                      width={56}
                      height={56}
                      className='rounded-md aspect-square w-full h-auto'
                      alt={item.name}
                      priority
                      sizes='(min-width: 1120px) calc(20vw - 106px), (min-width: 960px) calc(25vw - 121px), (min-width: 800px) calc(33.57vw - 150px), calc(25.83vw - 11px)'
                    />
                    <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'>
                      {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                      <PauseIcon className='h-1/2 w-1/2' />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
                    <strong className='text-white text-base block truncate'>
                      {item.name}
                    </strong>
                    <p className='text-zinc-400 text-sm truncate'>
                      {item.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
