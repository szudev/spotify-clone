import { spotifyWebApiErrorHandler } from '@/lib/errors'
import { Session } from 'next-auth'
import SpotifyWebApi from 'spotify-web-api-node'
import spotifyApiImported from '@/lib/spotify'

interface Props {
  id: string
  spotifyApi?: SpotifyWebApi
  session?: Session | null
}

export async function getTrackById({ id, session, spotifyApi }: Props) {
  try {
    if (spotifyApi && !session) {
      const { body, statusCode } = await spotifyApi.getTrack(id)
      return { body, statusCode }
    } else if (!spotifyApi && session) {
      if (session?.user && session.user.accessToken) {
        spotifyApiImported.setAccessToken(session.user.accessToken)
      }
      const { body, statusCode } = await spotifyApiImported.getTrack(id)
      return { body, statusCode }
    } else return { body: undefined, statusCode: 500 }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
