import { formatAlbumReleaseDateToYear } from '@/lib/utils'
import { SearchResults } from '@/services/search'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import Link from 'next/link'
import ClientCoverPlayer from './ClientCoverPlayer'
import CustomSearchedSongName from './CustomSearchedSongName'
import CustomSearchedSongDuration from './CustomSearchedSongDuration'
import { Suspense } from 'react'
import StreamCustomSearchAlbumPlayer from './StreamCustomSearchAlbumPlayer'
import StreamCustomSearchPlaylistPlayer from './StreamCustomSearchPlaylistPlayer'
import CustomSearchArtistSection from './CustomSearchArtistSection'
import ClientCurrentOnPlayCoverName from './ClientCurrentOnPlayCoverName'
import CustomSearchedSongItem from './CustomSearchedSongItem'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
}

export default async function CustomSearchedResult({
  queryParam,
  spotifyApi
}: Props) {
  const { body, statusCode } = await SearchResults({
    queryParam,
    spotifyApi,
    limit: 5,
    withArtists: true,
    withTracks: true
  })
  if (statusCode !== 200) return notFound()
  const topResultArtist = body?.artists?.items[0]

  return (
    <section className='flex flex-col flex-1'>
      <CustomSearchArtistSection
        body={body}
        spotifyApi={spotifyApi}
        topResultArtist={topResultArtist}
      >
        <div className='flex flex-col justify-start h-full gap-4'>
          <h1 className='text-white text-2xl font-bold'>Songs</h1>
          <section className='grid grid-cols-1 w-full grid-rows-[1fr] rounded-md gap-2 md:gap-0 flex-1'>
            {body?.tracks?.items.slice(0, 4).map((track, i) => (
              <CustomSearchedSongItem key={track.id} track={track} i={i} />
            ))}
          </section>
        </div>
      </CustomSearchArtistSection>
      <section className='flex flex-col justify-start h-full gap-4 pb-7'>
        <h1 className='text-white text-2xl font-bold'>Albums</h1>
        <div className='grid md:grid-cols-5 grid-cols-2 gap-4 md:gap-2'>
          {body?.albums?.items.map((album) => (
            <Link
              href={`/album/${album.id}`}
              key={album.id}
              className='grid grid-cols-1 grid-rows-[1fr_auto] rounded-md md:p-4 p-0 md:bg-black/30 bg-transparent md:bg-hover-effect md:gap-5 gap-2 group'
            >
              <div className='relative rounded-md'>
                <Image
                  src={
                    album.images.find((image) => image.url)?.url ??
                    '/404-img.png'
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
                <p className='text-zinc-400 md:hidden inline text-sm capitalize truncate rounded-full w-full'>
                  {formatAlbumReleaseDateToYear(album.release_date) ?? null}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className='flex flex-col justify-start h-full gap-4 pb-7'>
        <h1 className='text-white text-2xl font-bold'>Playlists</h1>
        <div className='grid md:grid-cols-5 grid-cols-2 md:gap-2 gap-4'>
          {body?.playlists?.items.map((playlist) => (
            <Link
              href={`/playlist/${playlist.id}`}
              key={playlist.id}
              className='grid grid-cols-1 grid-rows-[1fr_auto] rounded-md md:p-4 p-0 md:bg-black/30 bg-transparent md:bg-hover-effect md:gap-5 gap-2 group'
            >
              <div className='relative rounded-md'>
                <Image
                  src={
                    playlist.images.find((image) => image.url)?.url ??
                    '/404-img.png'
                  }
                  alt={`Playlist ${playlist.name} cover image`}
                  height={172}
                  width={172}
                  className='aspect-square rounded-md w-full h-auto'
                />
                <Suspense
                  fallback={
                    <div className='absolute z-10 bottom-0 -translate-y-1 opacity-100 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-zinc-700 animate-pulse' />
                  }
                >
                  <StreamCustomSearchPlaylistPlayer
                    playlist={playlist}
                    spotifyApi={spotifyApi}
                  />
                </Suspense>
              </div>
              <div className='flex flex-col items-start overflow-x-hidden'>
                <ClientCurrentOnPlayCoverName
                  name={playlist.name}
                  onPlay={{ playerType: 'playlist', playlistId: playlist.id }}
                />
                <p className='text-zinc-400 text-sm capitalize truncate rounded-full w-full'>
                  {playlist.owner.display_name ?? 'unkown'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  )
}
