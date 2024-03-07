import { getArtistTopTracks } from '@/services/artist'
import SpotifyWebApi from 'spotify-web-api-node'
import ClientPopularArtistSongsDisplayer from './ClientPopularArtistSongsDisplayer'
import { isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from './CustomTooManyRequestErrorBoundary'

interface Props {
  spotifyApi: SpotifyWebApi
  artistId: string
}

export default async function PopularArtistSongs({
  artistId,
  spotifyApi
}: Props) {
  const { body, statusCode, error } = await getArtistTopTracks({
    artistId,
    spotifyApi
  })

  if (statusCode !== 200) {
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
    throw new Error('An error occurred.')
  }

  if (!body)
    return (
      <div className='flex flex-col items-start gap-4'>
        <p className='text-zinc-400'>No songs were found.</p>
      </div>
    )

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
