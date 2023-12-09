import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  spotifyApi: SpotifyWebApi
}

export async function getUserSavedAlbums({ spotifyApi }: Props) {
  try {
    const { body, headers } = await spotifyApi.getMySavedAlbums({ limit: 4 })
    return { body, headers }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
