import { formatAlbumReleaseDateToYear } from '@/lib/utils'
import { SearchResults } from '@/services/search'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon } from './Icons'
import Link from 'next/link'
import ClientCoverPlayer from './ClientCoverPlayer'
import CustomSearchedSongName from './CustomSearchedSongName'
import CustomSearchedSongDuration from './CustomSearchedSongDuration'
import { Suspense } from 'react'
import StreamCustomSearchAlbumPlayer from './StreamCustomSearchAlbumPlayer'
import StreamCustomSearchPlaylistPlayer from './StreamCustomSearchPlaylistPlayer'
import CustomSearchArtistSection from './CustomSearchArtistSection'

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

  const topResultImageSrc =
    topResultArtist?.images.find((image) => image.url)?.url ?? '/404-img.png'

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
              <article
                key={track.id}
                className='grid grid-cols-[1fr_minmax(30px,auto)] rounded-md group md:bg-hover-effect md:p-2 p-0 items-center'
              >
                <div className='grid md:grid-cols-[40px_1fr] grid-cols-[25%_1fr] md:gap-4 gap-2'>
                  <div className='rounded-md relative'>
                    <Image
                      width={40}
                      height={40}
                      className='aspect-square md:group-hover:brightness-[.35] w-full h-auto rounded-md'
                      src={
                        track
                          ? track.album.images.find(
                              (img) => img.url !== undefined && img.url !== null
                            )?.url
                            ? (track.album.images.find(
                                (img) =>
                                  img.url !== undefined && img.url !== null
                              )?.url as string)
                            : '/404-img.png'
                          : '/404-img.png'
                      }
                      alt={`Cover image of song #${track ? track.id : i + 1}`}
                    />
                    <ClientCoverPlayer
                      playerType='song'
                      song={track}
                      uris={track.uri}
                      tracks={[track]}
                      iconStyles='h-1/2 w-1/2 fill-white'
                      buttonStyles='w-full h-full absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 group-hover:opacity-100 opacity-0 hidden md:flex items-center justify-center'
                      onPlayStyle=''
                    />
                  </div>
                  <div className='flex flex-col justify-center'>
                    <div className='table table-fixed w-full'>
                      <CustomSearchedSongName track={track} />
                    </div>
                    {track ? (
                      <div className='table table-fixed w-full'>
                        <span className='block text-xs truncate text-zinc-400'>
                          {track.artists
                            .map((artist) => artist.name)
                            .join(', ') ?? 'Unknown'}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <CustomSearchedSongDuration track={track} />
              </article>
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
                <p className='text-white font-bold capitalize truncate w-full'>
                  {album.name ?? 'unkown'}
                </p>
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
        C
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
                <p className='text-white font-bold capitalize truncate w-full'>
                  {playlist.name ?? 'unkown'}
                </p>
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
