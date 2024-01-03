import { getAlbumById } from '@/services/album'
import ClientCoverPlayer from './ClientCoverPlayer'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  album: SpotifyApi.AlbumObjectSimplified
  spotifyApi: SpotifyWebApi
}

export default async function StreamCustomSearchAlbumPlayer({
  album,
  spotifyApi
}: Props) {
  const { body, statusCode } = await getAlbumById({
    albumId: album.id,
    spotifyApi
  })
  if (!body || statusCode !== 200) return null

  const tracks: (SpotifyApi.TrackObjectFull | null)[] = body.tracks.items.map(
    (item) => {
      return {
        ...item,
        album: album,
        external_ids: body.external_ids,
        popularity: body.popularity
      }
    }
  )
  const uris = tracks
    .filter((track) => track !== null)
    .map((track) => track!.uri)

  return (
    <ClientCoverPlayer
      albumId={album.id}
      tracks={tracks}
      uris={uris}
      playerType='album'
      onPlayStyle='-translate-y-1 opacity-100'
      iconStyles='h-1/2 w-1/2'
      buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-1 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-green-500'
    />
  )
}
