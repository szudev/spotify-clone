import Image from 'next/image'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon, PlayIcon } from './Icons'
import Link from 'next/link'
import { getGreetingTime } from '@/lib/utils'
import { getUserSavedAlbums } from '@/services/album'
import { signOut } from 'next-auth/react'

interface Props {
  spotifyApi: SpotifyWebApi
}

export default async function RecentlyPlayed({ spotifyApi }: Props) {
  const { body: savedAlbums, statusCode } = await getUserSavedAlbums({
    spotifyApi
  })

  if (statusCode === 401) return await signOut({ callbackUrl: `/login` })

  return (
    <section className='flex flex-col gap-6'>
      <div className='flex items-center'>
        <h1 className='text-white text-xl font-semibold'>
          {getGreetingTime()}
        </h1>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Link
            href={'/genre/recently-played'}
            className='text-white text-xl font-semibold'
          >
            Albums
          </Link>
          {savedAlbums?.next ? (
            <Link
              href={'/genre/albums'}
              className='text-zinc-400 text-sm hover:underline'
            >
              Show all
            </Link>
          ) : null}
        </div>
        {savedAlbums && (
          <div className='grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2'>
            {savedAlbums.items.map((album) => (
              <Link
                key={album.album.id}
                href={`/album/${album.album.id}`}
                className='md:flex md:flex-col grid grid-cols-[40%_1fr] md:bg-[#171717] bg-[#222222] md:bg-hover-effect flex-row group gap-2 md:gap-4 p-0 md:p-4 rounded-md'
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
                </div>
                <div className='flex flex-row md:flex-col gap-0 md:gap-1 md:items-start items-center pr-2 py-2 md:pr-0 md:py-0 justify-start'>
                  <strong className='text-white text-xs md:text-xl'>
                    {album.album.name}
                  </strong>
                  <p className='text-zinc-400 md:inline hidden text-sm'>
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
      <p className='text-white'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
        provident nisi facilis eum eaque, illo officia numquam nihil ratione
        enim tempora quo atque
      </p>
    </section>
  )
}
