import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  spotifyApi: SpotifyWebApi
  limit?: number
  pageParam?: number
}

export async function getUserSavedAlbums({
  spotifyApi,
  limit = 4,
  pageParam = 0
}: Props) {
  try {
    const { body, headers } = await spotifyApi.getMySavedAlbums({
      limit,
      offset: pageParam
    })
    return { body, headers }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
