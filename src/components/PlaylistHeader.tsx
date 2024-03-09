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
import { isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from './CustomTooManyRequestErrorBoundary'

interface Props {
  spotifyApi: SpotifyWebApi
  playlistId: string
}

export default async function PlaylistHeader({
  spotifyApi,
  playlistId
}: Props) {
  const {
    body: playlistBody,
    statusCode: playlistStatusCode,
    error: playlistError
  } = await getPlaylistById({ playlistId, spotifyApi })

  if (!playlistBody || playlistStatusCode !== 200) {
    if (playlistStatusCode === 429) {
      if (isCustomApiErrorObject(playlistError)) {
        const retryAfter = playlistError.headers['retry-after']
          ? parseInt(playlistError.headers['retry-after'], 10)
          : undefined
        return (
          <CustomTooManyRequestErrorBoundary
            statusCode={playlistStatusCode}
            retryAfter={retryAfter}
          />
        )
      } else {
        return (
          <CustomTooManyRequestErrorBoundary statusCode={playlistStatusCode} />
        )
      }
    }
    if (
      !playlistBody ||
      playlistStatusCode === 404 ||
      playlistStatusCode === 204
    ) {
      notFound()
    }
    throw new Error('An error occurred.')
  }

  const { body: userBody } = await getUserById({
    userId: playlistBody.owner.id,
    spotifyApi
  })

  const PlaylistName = dynamic(() => import('./PlaylistName'), {
    ssr: false,
    loading: () => (
      <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
    )
  })

  const filteredPlaylist = playlistBody.tracks.items.filter(
    (item) => item.track !== null && item.track.id
  )
  const playlistTracksCount = filteredPlaylist.length

  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center md:pt-8 gap-4 md:px-6 px-4'>
      <Image
        src={playlistBody.images[0].url}
        width={192}
        height={192}
        alt={`Playlist #${playlistBody.id} cover image.`}
        className='rounded-md aspect-square shadow-2xl'
        priority
      />
      <div
        className={cn('flex flex-col justify-end self-start md:self-center', {
          'gap-6': !playlistBody.description,
          'gap-2': playlistBody.description
        })}
      >
        <div className='flex flex-col gap-2'>
          <p className='text-white text-base hidden md:inline'>Playlist</p>
          <PlaylistName playlistName={playlistBody.name} />
          {playlistBody.description && (
            <span className='text-zinc-300'>
              {playlistBody.description.replace(/<\/?[^>]+(>|$)/g, '')}
            </span>
          )}
        </div>
        <div className='text-base flex gap-1 md:flex-row flex-col md:items-center items-start'>
          <div className='flex items-center gap-1'>
            {userBody &&
              userBody.images &&
              userBody.images.find(
                (img) => img.url !== undefined && img.url !== null
              )?.url !== undefined && (
                <Image
                  src={
                    userBody.images.find(
                      (img) => img.url !== undefined && img.url !== null
                    )?.url as string
                  }
                  alt={`Profile picture of user #${playlistBody.owner.id}`}
                  className='rounded-full'
                  width={32}
                  height={32}
                />
              )}
            <strong className='text-white hover:underline cursor-pointer'>
              {playlistBody.owner.display_name
                ? playlistBody.owner.display_name
                : userBody && userBody.display_name
                ? userBody.display_name
                : 'Unknown'}
            </strong>
          </div>
          <span className='before:content-["•"] hidden md:inline before:text-white before:mx-1 '>
            <span className='text-white'>
              {playlistTracksCount > 1
                ? `${playlistTracksCount} songs, `
                : `${playlistTracksCount} song, `}
            </span>
            <span className='text-zinc-300'>
              about{' '}
              {formatPlaylistTotalDuration(
                filteredPlaylist.reduce((acc, currValue) => {
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
              filteredPlaylist.reduce((acc, currValue) => {
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
