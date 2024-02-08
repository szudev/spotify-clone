import { getArtistTopTracks } from '@/services/artist'
import SpotifyWebApi from 'spotify-web-api-node'
import ClientPopularArtistSongsDisplayer from './ClientPopularArtistSongsDisplayer'

interface Props {
  spotifyApi: SpotifyWebApi
  artistId: string
}

export default async function PopularArtistSongs({
  artistId,
  spotifyApi
}: Props) {
  const { body, statusCode } = await getArtistTopTracks({
    artistId,
    spotifyApi
  })

  if (!body || statusCode !== 200) return null

  const tracks = body.tracks.filter((track) => track.uri)
  const uris = body.tracks
    .filter((track) => track.uri)
    .map((track) => track.uri)

  return (
    <div className='flex flex-col items-start gap-4'>
      <ClientPopularArtistSongsDisplayer
        artistId={artistId}
        tracks={tracks}
        uris={uris}
      />
    </div>
  )
}
