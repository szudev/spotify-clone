import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
}

export async function SearchResults({ queryParam, spotifyApi }: Props) {
  try {
    const { body, statusCode } = await spotifyApi.search(
      queryParam,
      ['playlist', 'album'],
      { limit: 5, offset: 0 }
    )
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
