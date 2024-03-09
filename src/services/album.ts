import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'

interface UserSavedAlbumProps {
  spotifyApi: SpotifyWebApi
  limit?: number
  pageParam?: number
}

interface AlbumByIdProps {
  albumId: string
  spotifyApi: SpotifyWebApi
}

export async function getUserSavedAlbums({
  spotifyApi,
  limit = 5,
  pageParam = 0
}: UserSavedAlbumProps) {
  try {
    const { body, statusCode } = await spotifyApi.getMySavedAlbums({
      limit,
      offset: pageParam
    })
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}

export async function getAlbumById({ albumId, spotifyApi }: AlbumByIdProps) {
  try {
    const { body, statusCode } = await spotifyApi.getAlbum(albumId)
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}

export async function getAlbumTracksById({
  albumId,
  spotifyApi
}: AlbumByIdProps) {
  try {
    const { body, statusCode } = await spotifyApi.getAlbumTracks(albumId)
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
