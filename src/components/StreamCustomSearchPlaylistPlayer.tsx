import SpotifyWebApi from 'spotify-web-api-node'
import ClientCoverPlayer from './ClientCoverPlayer'
import { getPlaylistTracksById } from '@/services/playlists'

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified
  spotifyApi: SpotifyWebApi
}

export default async function StreamCustomSearchPlaylistPlayer({
  playlist,
  spotifyApi
}: Props) {
  const { body, statusCode } = await getPlaylistTracksById({
    playlistId: playlist.id,
    spotifyApi
  })

  if (!body || statusCode !== 200) return null

  const tracks = body.items
    .filter((item) => item.track !== null)
    .map((item) => item.track)
  const uris = tracks.filter((track) => track!.uri).map((track) => track!.uri)

  return (
    <ClientCoverPlayer
      playerType='playlist'
      onPlayStyle='opacity-100 -translate-y-1'
      iconStyles='h-1/2 w-1/2'
      buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'
      playlistId={playlist.id}
      tracks={tracks}
      uris={uris}
    />
  )
}
