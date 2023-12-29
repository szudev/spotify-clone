import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
  limit?: number
  withArtists?: boolean
  withTracks?: boolean
}

export async function SearchResults({
  queryParam,
  spotifyApi,
  limit,
  withArtists,
  withTracks
}: Props) {
  try {
    const { body, statusCode } = await spotifyApi.search(
      queryParam,
      withArtists === true && withTracks === true
        ? ['playlist', 'album', 'artist', 'track']
        : ['playlist', 'album'],
      { limit: limit ?? 5, offset: 0 }
    )
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
