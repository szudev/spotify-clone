import { getArtistAlbums } from '@/services/artist'
import Link from 'next/link'
import SpotifyWebApi from 'spotify-web-api-node'
import Image from 'next/image'
import { Suspense } from 'react'
import StreamCustomSearchAlbumPlayer from './StreamCustomSearchAlbumPlayer'
import ClientCurrentOnPlayCoverName from './ClientCurrentOnPlayCoverName'
import { formatAlbumReleaseDateToYear } from '@/lib/utils'

interface Props {
  spotifyApi: SpotifyWebApi
  artistId: string
}

export default async function ArtistAlbums({ artistId, spotifyApi }: Props) {
  const { body, statusCode } = await getArtistAlbums({ artistId, spotifyApi })
  if (!body || statusCode !== 200) return null

  return (
    <section className='flex flex-col justify-start h-full gap-4 md:pb-7 pb-7 pt-0 md:px-6 px-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-white text-2xl font-bold'>Artist Albums</h1>
        {body.total > 5 ? (
          <Link
            href={`/artist/${artistId}/albums`}
            className='text-zinc-400 text-sm hover:underline'
          >
            Show all
          </Link>
        ) : null}
      </div>
      <div className='grid md:grid-cols-5 grid-cols-2 md:gap-2 gap-4'>
        {body.items.map((album) => (
          <Link
            href={`/album/${album.id}`}
            key={album.id}
            className='grid grid-cols-1 grid-rows-[1fr_auto] rounded-md md:p-4 p-0 md:bg-black/30 bg-transparent md:bg-hover-effect md:gap-5 gap-2 group'
          >
            <div className='relative rounded-md'>
              <Image
                src={
                  album.images.find((image) => image.url)?.url ?? '/404-img.png'
                }
                alt={`Album ${album.name} cover image`}
                height={172}
                width={172}
                className='aspect-square rounded-md w-full h-auto'
              />
              <Suspense
                fallback={
                  <div className='absolute z-10 bottom-0 -translate-y-1 opacity-100 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-zinc-700 animate-pulse' />
                }
              >
                <StreamCustomSearchAlbumPlayer
                  album={album}
                  spotifyApi={spotifyApi}
                />
              </Suspense>
            </div>
            <div className='flex flex-col items-start overflow-x-hidden'>
              <ClientCurrentOnPlayCoverName
                name={album.name}
                onPlay={{ playerType: 'album', albumId: album.id }}
              />
              <p className='text-zinc-400 text-sm capitalize truncate rounded-full w-full'>
                {album.artists.map((artist) => artist.name).join(', ') ??
                  'unkown'}
              </p>
              <p className='text-zinc-400 md:hidden inline text-sm capitalize truncate rounded-full'>
                {formatAlbumReleaseDateToYear(album.release_date) ?? null}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
