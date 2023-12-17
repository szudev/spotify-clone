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
  const uris = playlist.items
    .filter((item) => item.track !== null)
    .map((track) => track.track!.uri)
  const tracks = playlist.items
    .filter((item) => item.track !== null)
    .map((track) => track.track)
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
        {playlist.items.map((track, i) => {
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
            />
          )
        })}
      </div>
    </section>
  )
}
