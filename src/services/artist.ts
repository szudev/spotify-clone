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

export async function getArtistTopTracks({
  artistId,
  spotifyApi
}: ArtistByIdProps) {
  try {
    const { body: userInfo, statusCode: userInfoStatusCode } =
      await spotifyApi.getMe()
    if (!userInfo || userInfoStatusCode !== 200) throw new Error()
    const { body, statusCode } = await spotifyApi.getArtistTopTracks(
      artistId,
      userInfo.country
    )
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}

export async function getArtistAlbums({
  artistId,
  spotifyApi
}: ArtistByIdProps) {
  try {
    const { body, statusCode } = await spotifyApi.getArtistAlbums(artistId, {
      limit: 5
    })
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
