import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface ArtistByIdProps {
  artistId: string
  spotifyApi: SpotifyWebApi
}

export async function getArtistById({ artistId, spotifyApi }: ArtistByIdProps) {
  try {
    const { body, statusCode } = await spotifyApi.getArtist(artistId)
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
