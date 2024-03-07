import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

export async function getUserById({
  userId,
  spotifyApi
}: {
  userId: string
  spotifyApi: SpotifyWebApi
}) {
  try {
    const { body, statusCode } = await spotifyApi.getUser(userId)
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}
