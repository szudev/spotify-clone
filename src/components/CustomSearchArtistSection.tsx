import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import StreamCustomSearchArtistPlayer from './StreamCustomSearchArtistPlayer'

interface Props {
  children: React.ReactNode
  topResultArtist: SpotifyApi.ArtistObjectFull | undefined
  body: SpotifyApi.SearchResponse | undefined
  spotifyApi: SpotifyWebApi
}

export default async function CustomSearchArtistSection({
  children,
  topResultArtist,
  body,
  spotifyApi
}: Props) {
  const topResultImageSrc =
    topResultArtist?.images.find((image) => image.url)?.url ?? '/404-img.png'
  return (
    <>
      <section className='grid lg:grid-cols-[40%_1fr] md:grid-cols-2 gap-4 grid-rows-[1fr] items-end md:py-7 pb-7 pt-0'>
        {topResultArtist ? (
          <div className='flex flex-col min-w-0 justify-start h-full gap-4'>
            <h1 className='text-white text-2xl font-bold md:inline hidden'>
              Top result
            </h1>
            <Link
              href={`/artist/${topResultArtist.id}`}
              className='flex md:flex-col flex-row group md:p-5 p-0 relative md:hover:cursor-pointer gap-3 rounded-md md:bg-black/30 bg-transparent md:bg-hover-effect'
            >
              <Image
                src={topResultImageSrc}
                alt={
                  body && body.artists && topResultArtist
                    ? `Artist ${topResultArtist.name} profile image`
                    : `Unkown artist profile picture`
                }
                className='rounded-full aspect-square'
                height={92}
                width={92}
                priority
              />
              <div className='flex gap-1 flex-col items-start justify-center overflow-hidden'>
                <p className='text-white md:text-[2rem] text-base font-bold capitalize truncate block w-full'>
                  {topResultArtist.name ?? 'unkown'}
                </p>
                <p className='md:text-white text-zinc-400 text-sm capitalize font-medium rounded-full md:py-1 md:px-2 p-0 md:bg-black bg-transparent'>
                  {topResultArtist.type ?? 'unkown'}
                </p>
              </div>
              {topResultArtist ? (
                <Suspense
                  fallback={
                    <div className='absolute z-10 bottom-0 opacity-100 -translate-y-5 hidden md:flex items-center justify-center right-0 mx-5 rounded-full w-12 h-12 bg-zinc-700 animate-pulse' />
                  }
                >
                  <StreamCustomSearchArtistPlayer
                    spotifyApi={spotifyApi}
                    artist={topResultArtist}
                  />
                </Suspense>
              ) : null}
            </Link>
          </div>
        ) : null}
        {children}
      </section>
      <section className='flex flex-col justify-start h-full gap-4 pb-7'>
        <h1 className='text-white text-2xl font-bold'>Artists</h1>
        <div className='grid md:grid-cols-5 grid-cols-1 grid-rows-[1fr] gap-4'>
          {body?.artists?.items.map((artist) => (
            <Link
              href={`/artist/${artist.id}`}
              key={artist.id}
              className='grid md:grid-cols-1 grid-cols-[25%_1fr] grid-rows-[1fr] md:grid-rows-[1fr_auto] md:p-4 p-0 md:gap-5 gap-2 rounded-md group md:bg-black/30 bg-transparent md:bg-hover-effect'
            >
              <div className='relative rounded-full'>
                <Image
                  src={
                    artist.images.find((image) => image.url)?.url ??
                    '/404-img.png'
                  }
                  alt={`Artist ${artist.name} profile image`}
                  height={172}
                  width={172}
                  className='aspect-square rounded-full w-full h-auto'
                />
                <Suspense
                  fallback={
                    <div className='absolute z-10 bottom-0 opacity-100 -translate-y-1 hidden md:flex items-center justify-center right-0 mx-5 rounded-full w-12 h-12 bg-zinc-700 animate-pulse' />
                  }
                >
                  <StreamCustomSearchArtistPlayer
                    artist={artist}
                    spotifyApi={spotifyApi}
                    customButtonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'
                    customOnPlayStyles='opacity-100 -translate-y-1'
                  />
                </Suspense>
              </div>
              <div className='flex flex-col items-start justify-center overflow-x-hidden'>
                <p className='text-white font-bold capitalize text-base truncate w-full'>
                  {artist.name ?? 'unkown'}
                </p>
                <p className='text-zinc-400 hidden md:flex md:text-sm text-xs capitalize truncate rounded-full'>
                  {artist.type ?? 'unkown'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
