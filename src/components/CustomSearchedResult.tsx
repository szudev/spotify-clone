import { formatAlbumReleaseDateToYear, formatSongDuration } from '@/lib/utils'
import { SearchResults } from '@/services/search'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import { PauseIcon } from './Icons'
import Link from 'next/link'

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
      <section className='grid lg:grid-cols-[40%_1fr] md:grid-cols-2 gap-4 grid-rows-[1fr] items-end md:py-7 pb-7 pt-0'>
        <div className='flex flex-col min-w-0 justify-start h-full gap-4'>
          <h1 className='text-white text-2xl font-bold md:inline hidden'>
            Top result
          </h1>
          <article className='flex md:flex-col flex-row group md:p-5 p-0 relative md:hover:cursor-pointer gap-3 rounded-md md:bg-black/30 bg-transparent md:bg-hover-effect'>
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
                {topResultArtist?.name ?? 'unkown'}
              </p>
              <p className='md:text-white text-zinc-400 text-sm capitalize font-medium rounded-full md:py-1 md:px-2 p-0 md:bg-black bg-transparent'>
                {topResultArtist?.type ?? 'unkown'}
              </p>
            </div>
            <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-5 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-5 rounded-full w-12 h-12 bg-green-500'>
              {/*<PlayIcon className='h-1/2 w-1/2' />*/}
              <PauseIcon className='h-1/2 w-1/2' />
            </div>
          </article>
        </div>
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
                    <div className='w-full h-full absolute z-10 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 group-hover:opacity-100 opacity-0 hidden md:flex items-center justify-center'>
                      {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                      <PauseIcon className='h-1/2 w-1/2 fill-white' />
                    </div>
                  </div>
                  <div className='flex flex-col justify-center'>
                    <div className='table table-fixed w-full'>
                      <h3
                        className={`${
                          /* currentTrack?.song?.id === track.id */
                          true ? 'text-[#1ed760]' : 'text-white'
                        } block truncate md:text-sm text-base hover:cursor-pointer hover:underline`}
                      >
                        {track ? track.name : 'Unknown'}
                      </h3>
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
                <div className='col-start-5 md:flex text-sm justify-center text-zinc-400 hidden'>
                  {track ? formatSongDuration(track.duration_ms) : '-:--'}
                </div>
              </article>
            ))}
          </section>
        </div>
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
                <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'>
                  {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                  <PauseIcon className='h-1/2 w-1/2' />
                </div>
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
                <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'>
                  {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                  <PauseIcon className='h-1/2 w-1/2' />
                </div>
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
                <div className='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'>
                  {/*<PlayIcon className='h-1/2 w-1/2' />*/}
                  <PauseIcon className='h-1/2 w-1/2' />
                </div>
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
