import SpotifyWebApi from 'spotify-web-api-node'
import { DurationIcon } from './Icons'
import { getPlaylistTracksById } from '@/services/playlists'
import { notFound } from 'next/navigation'
import PlaylistTableItem from './PlaylistTableItem'

interface Props {
  spotifyApi: SpotifyWebApi
  playlistId: string
}

export default async function PlaylistTable({ playlistId, spotifyApi }: Props) {
  const playlistResponse = await getPlaylistTracksById({
    playlistId,
    spotifyApi
  })
  if (!playlistResponse || playlistResponse.statusCode !== 200)
    return notFound()

  const { body: playlist } = playlistResponse
  return (
    <section className='flex flex-col pb-4 px-6 flex-1 pt-6'>
      <div className='grid grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] gap-x-4 w-full'>
        <div className='grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] pl-6 gap-x-4 grid col-span-5 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
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
        {playlist.items.map((track, i) => (
          <PlaylistTableItem
            key={
              track.track
                ? track.track.id
                : `${i + 1}-${track.added_at}-${track.added_by.id}`
            }
            token={spotifyApi.getAccessToken()}
            i={i}
            track={track}
          />
        ))}
      </div>
    </section>
  )
}
