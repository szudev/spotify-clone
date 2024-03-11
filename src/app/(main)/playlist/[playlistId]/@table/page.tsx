import CustomTooManyRequestErrorBoundary from '@/components/CustomTooManyRequestErrorBoundary'
import { DurationIcon } from '@/components/Icons'
import PlaylistTableItem from '@/components/PlaylistTableItem'
import { getAuthSession } from '@/lib/auth'
import { isCustomApiErrorObject } from '@/lib/errors'
import spotifyApi from '@/lib/spotify'
import { getPlaylistTracksById } from '@/services/playlists'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    playlistId: string
  }
}

export default async function PlaylistTable({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode, error } = await getPlaylistTracksById({
    playlistId,
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
        <div className='flex flex-col items-center justify-center pb-4 md:px-6 px-4 flex-1 md:pt-6 pt-0'>
          <p className='text-zinc-400'>No content were found.</p>
        </div>
      )
    }
    throw new Error('An error occurred.')
  }

  const filteredPlaylist = body.items.filter(
    (item) => item.track !== null && item.track.id
  )
  const uris = filteredPlaylist.map((track) => track.track!.uri)
  const tracks = filteredPlaylist.map((track) => track.track)

  return (
    <section className='flex flex-col pb-4 md:px-6 px-4 flex-1 md:pt-6 pt-0'>
      <div className='grid md:grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] grid-cols-1 gap-x-4 w-full'>
        <div className='grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] pl-6 gap-x-4 hidden md:grid col-span-5 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
          <div className='flex items-center justify-center text-zinc-400'>
            #
          </div>
          <div className='flex items-center justify-start text-zinc-400'>
            Title
          </div>
          <div className='flex items-center justify-start text-zinc-400'>
            Album
          </div>
          <div className='flex items-center justify-start text-zinc-400'>
            Date added
          </div>
          <div className='flex items-center justify-center text-zinc-400'>
            <DurationIcon className='h-4 w-4' />
          </div>
        </div>
        {filteredPlaylist.map((track, i) => {
          if (!track.track) return null
          return (
            <PlaylistTableItem
              key={
                track.track
                  ? track.track.id
                  : `${i + 1}-${track.added_at}-${track.added_by.id}`
              }
              token={spotifyApi.getAccessToken()}
              i={i}
              track={track}
              uris={uris}
              tracks={tracks}
              playlistId={playlistId}
            />
          )
        })}
      </div>
    </section>
  )
}
