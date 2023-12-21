import { getPlaylistById } from '@/services/playlists'
import { getUserById } from '@/services/user'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  cn,
  formatPlaylistTotalDuration,
  hasMillisecondProperty
} from '@/lib/utils'

interface Props {
  spotifyApi: SpotifyWebApi
  playlistId: string
}

export default async function PlaylistHeader({
  spotifyApi,
  playlistId
}: Props) {
  const playlistResponse = await getPlaylistById({ playlistId, spotifyApi })
  if (!playlistResponse || playlistResponse.statusCode !== 200)
    return notFound()
  const userResponse = await getUserById({
    userId: playlistResponse.body.owner.id,
    spotifyApi
  })
  if (!userResponse || userResponse.statusCode !== 200) return notFound()

  const PlaylistName = dynamic(() => import('./PlaylistName'), {
    ssr: false,
    loading: () => (
      <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
    )
  })

  const { body: playlist } = playlistResponse
  const { body: playlistUser } = userResponse

  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center md:pt-8 gap-4 md:px-6 px-4'>
      <Image
        src={playlist.images[0].url}
        width={192}
        height={192}
        alt={`Playlist #${playlist.id} cover image.`}
        className='rounded-md aspect-square shadow-2xl'
        priority
      />
      <div
        className={cn('flex flex-col justify-end self-start md:self-center', {
          'gap-6': !playlist.description,
          'gap-2': playlist.description
        })}
      >
        <div className='flex flex-col gap-2'>
          <p className='text-white text-base hidden md:inline'>Playlist</p>
          <PlaylistName playlistName={playlist.name} />
          {playlist.description && (
            <span className='text-zinc-300'>
              {playlist.description.replace(/<\/?[^>]+(>|$)/g, '')}
            </span>
          )}
        </div>
        <div className='text-base flex gap-1 md:flex-row flex-col md:items-center items-start'>
          <div className='flex items-center gap-1'>
            {playlistUser.images &&
              playlistUser.images.find(
                (img) => img.url !== undefined && img.url !== null
              )?.url !== undefined && (
                <Image
                  src={
                    playlistUser.images.find(
                      (img) => img.url !== undefined && img.url !== null
                    )?.url as string
                  }
                  alt={`Profile picture of user #${playlist.owner.id}`}
                  className='rounded-full'
                  width={32}
                  height={32}
                />
              )}
            <strong className='text-white hover:underline cursor-pointer'>
              {playlist.owner.display_name
                ? playlist.owner.display_name
                : playlistUser.display_name
                ? playlistUser.display_name
                : 'Unknown'}
            </strong>
          </div>
          <span className='before:content-["•"] hidden md:inline before:text-white before:mx-1 '>
            <span className='text-white'>
              {playlist.tracks.total > 1
                ? `${playlist.tracks.total} songs, `
                : `${playlist.tracks.total} song, `}
            </span>
            <span className='text-zinc-300'>
              about{' '}
              {formatPlaylistTotalDuration(
                playlist.tracks.items.reduce((acc, currValue) => {
                  if (currValue.track) {
                    if (typeof currValue.track.duration_ms !== 'number') {
                      if (hasMillisecondProperty(currValue.track.duration_ms)) {
                        return (acc += (
                          currValue.track.duration_ms as {
                            totalMilliseconds: number
                          }
                        ).totalMilliseconds)
                      } else return acc
                    }
                    return (acc += currValue.track.duration_ms)
                  }
                  return acc
                }, 0)
              )}
            </span>
          </span>
          <span className='text-zinc-300 inline md:hidden'>
            {formatPlaylistTotalDuration(
              playlist.tracks.items.reduce((acc, currValue) => {
                if (currValue.track) {
                  if (typeof currValue.track.duration_ms !== 'number') {
                    if (hasMillisecondProperty(currValue.track.duration_ms)) {
                      return (acc += (
                        currValue.track.duration_ms as {
                          totalMilliseconds: number
                        }
                      ).totalMilliseconds)
                    } else return acc
                  }
                  return (acc += currValue.track.duration_ms)
                }
                return acc
              }, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
