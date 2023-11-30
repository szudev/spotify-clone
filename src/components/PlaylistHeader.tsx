import { getPlaylistById } from '@/services/playlists'
import { getUserById } from '@/services/user'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import Image from 'next/image'
import { cn, formatSongDuration } from '@/lib/utils'

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

  const { body: playlist } = playlistResponse
  const { body: playlistUser } = userResponse

  return (
    <div className='flex pt-8 gap-4 px-6'>
      <Image
        src={playlist.images[0].url}
        width={192}
        height={192}
        alt={`Playlist #${playlist.id} cover image.`}
        className='rounded-md aspect-square'
        priority
      />
      <div
        className={cn('flex flex-col justify-end', {
          'gap-6': !playlist.description,
          'gap-2': playlist.description
        })}
      >
        <div className='flex flex-col gap-2'>
          <p className='text-white text-base'>Playlist</p>
          <h1 className='font-bold text-6xl text-white'>{playlist.name}</h1>
          {playlist.description && (
            <span className='text-zinc-300'>
              {playlist.description.replace(/<\/?[^>]+(>|$)/g, '')}
            </span>
          )}
        </div>
        <div className='text-base flex gap-1 items-center'>
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
          <span className='before:content-["•"] before:text-white before:mx-1 '>
            <span className='text-white'>
              {playlist.tracks.total > 1
                ? `${playlist.tracks.total} songs, `
                : `${playlist.tracks.total} song, `}
            </span>
            <span className='text-zinc-300'>
              about{' '}
              {formatSongDuration(
                playlist.tracks.items.reduce((acc, currValue) => {
                  if (currValue.track) {
                    return (acc += currValue.track.duration_ms)
                  }
                  return acc
                }, 0)
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
