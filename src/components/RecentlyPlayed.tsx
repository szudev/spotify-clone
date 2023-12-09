import Image from 'next/image'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon, PlayIcon } from './Icons'
import Link from 'next/link'
import { getGreetingTime } from '@/lib/utils'
import { getUserSavedAlbums } from '@/services/album'

interface Props {
  spotifyApi: SpotifyWebApi
}

export default async function RecentlyPlayed({ spotifyApi }: Props) {
  const { body } = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: 4
  })
  const { body: savedAlbums, statusCode } = await getUserSavedAlbums({
    spotifyApi
  })

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <Link
          href={'/genre/recently-played'}
          className='text-white text-xl font-semibold'
        >
          {getGreetingTime()}
        </Link>
        {body.next ? (
          <Link
            href={'/genre/recently-played'}
            className='text-zinc-400 text-sm hover:underline'
          >
            Show all
          </Link>
        ) : null}
      </div>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4'>
        {body.items.map((song) => (
          <Link
            key={song.track.id}
            href={`/${song.context?.type ?? song.track.type}/${
              song.track.album.id
            }`}
            className='flex flex-col group p-4 gap-4 bg-[#171717] bg-hover-effect rounded-md'
          >
            <div className='relative rounded-md'>
              <Image
                src={song.track.album.images[0].url}
                width={song.track.album.images[0].width}
                height={song.track.album.images[0].height}
                className='rounded-md aspect-square'
                alt={song.track.album.name}
                priority
                sizes='(min-width: 980px) calc(25vw - 124px), (min-width: 820px) calc(33.57vw - 152px), (min-width: 780px) calc(50vw - 201px), (min-width: 720px) calc(25vw - 60px), (min-width: 560px) calc(32.86vw - 61px), (min-width: 380px) calc(50vw - 72px), calc(100vw - 96px)'
              />
              <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'>
                {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                <PauseIcon className='h-1/2 w-1/2' />
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <strong className='text-white text-xl truncate'>
                {song.track.name}
              </strong>
              <p className='text-zinc-400 text-sm'>
                {song.track.artists[0].name}
              </p>
            </div>
          </Link>
        ))}
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
              <div className='flex flex-row md:flex-col gap-0 md:gap-1 md:items-start items-center pr-2 py-2 md:pr-0 md:py-0 justify-center'>
                <strong className='text-white text-xs md:text-xl'>
                  {album.album.name}
                </strong>
                <p className='text-zinc-400 md:inline hidden text-sm'>
                  {album.album.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <p className='text-white'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
        provident nisi facilis eum eaque, illo officia numquam nihil ratione
        enim tempora quo atque
      </p>
    </section>
  )
}
