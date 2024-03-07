import { SearchResults } from '@/services/search'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import { cn } from '@/lib/utils'
import GenreSearchedPlaylistItem from './GenreSearchedPlaylistItem'
import GenreSearchedAlbumItem from './GenreSearchedAlbumItem'
import { isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from './CustomTooManyRequestErrorBoundary'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
}

export default async function GenreSearchedResult({
  queryParam,
  spotifyApi
}: Props) {
  const { body, statusCode, error } = await SearchResults({
    queryParam,
    spotifyApi
  })

  if (!body || statusCode !== 200) {
    if (statusCode === 429) {
      if (isCustomApiErrorObject(error)) {
        const retryAfter = error.headers['retry-after']
          ? parseInt(error.headers['retry-after'], 10)
          : undefined
        return (
          <CustomTooManyRequestErrorBoundary
            statusCode={statusCode}
            retryAfter={retryAfter}
          />
        )
      } else {
        return <CustomTooManyRequestErrorBoundary statusCode={statusCode} />
      }
    }
    if (statusCode === 404) {
      notFound()
    }
    if (!body || statusCode === 204) {
      return (
        <div className='flex flex-col flex-1'>
          <p className='text-zinc-400'>No content were found.</p>
        </div>
      )
    }
    throw new Error()
  }

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
                <GenreSearchedPlaylistItem
                  key={item.id}
                  playlistItem={item}
                  spotifyApi={spotifyApi}
                />
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
                <GenreSearchedAlbumItem
                  key={item.id}
                  albumItem={item}
                  spotifyApi={spotifyApi}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
