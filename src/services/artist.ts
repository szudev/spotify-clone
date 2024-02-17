import { ApiStatusCodes, spotifyWebApiErrorHandler } from '@/lib/errors'
import { Session } from 'next-auth'
import SpotifyWebApi from 'spotify-web-api-node'
import spotifyApiImported from '@/lib/spotify'
import { getAlbumTracksById } from './album'
import { getTrackById } from './track'

class SpotifyApiError extends Error {
  statusCode: number

  constructor(statusCode: number) {
    super()
    this.name = 'SpotifyApiError'
    this.statusCode = statusCode
  }
}

interface ArtistByIdProps {
  artistId: string
  spotifyApi: SpotifyWebApi
}

interface ArtistAlbumPaginatedProps {
  artistId: string
  session?: Session | null
  limit: number
  offset: number
  spotifyApi?: SpotifyWebApi
}

export type CustomPagingArtistAlbumObject =
  SpotifyApi.PagingObject<CustomAlbumObject>

type CustomAlbumObject = SpotifyApi.AlbumObjectSimplified & {
  tracks: (SpotifyApi.TrackObjectFull | null)[]
}

export type ArtistAlbumsReturnType =
  | {
      body?: CustomPagingArtistAlbumObject
      statusCode: ApiStatusCodes
      error?: undefined
    }
  | {
      statusCode: ApiStatusCodes
      error: unknown
      body?: undefined
    }

export async function getArtistById({ artistId, spotifyApi }: ArtistByIdProps) {
  try {
    const { body, statusCode } = await spotifyApi.getArtist(artistId)
    return { body, statusCode }
  } catch (error) {
    return {
      statusCode: spotifyWebApiErrorHandler(error),
      error
    }
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

export async function getArtistAlbumsPaginated({
  artistId,
  limit,
  offset,
  session,
  spotifyApi
}: ArtistAlbumPaginatedProps): Promise<ArtistAlbumsReturnType> {
  try {
    if (spotifyApi && !session) {
      const { body, statusCode } = await spotifyApi.getArtistAlbums(artistId, {
        limit,
        offset
      })
      if (statusCode !== 200) throw new SpotifyApiError(statusCode)
      if (!body.items || body.items.length === 0)
        return { body: undefined, statusCode }

      const promises = body.items.map(async (item) => {
        const { body: albumTracksBody, statusCode: albumTracksStatusCode } =
          await getAlbumTracksById({ albumId: item.id, spotifyApi })
        if (!albumTracksBody || albumTracksStatusCode !== 200) return null
        const fullTrackPromises = albumTracksBody.items.map(
          async (trackItem) => {
            const { body, statusCode } = await getTrackById({
              id: trackItem.id,
              spotifyApi
            })
            if (!body || statusCode !== 200) return null
            return body
          }
        )
        const fullTrackObjects: (SpotifyApi.TrackObjectFull | null)[] =
          await Promise.all(fullTrackPromises)
        return { tracks: fullTrackObjects, albumId: item.id }
      })

      const resultsOfPromises = await Promise.all(promises)

      const finalBody: CustomPagingArtistAlbumObject = {
        ...body,
        items: body.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.albumId === item.id
          )
          if (!searchInResult) return null
          const albumTracks: (SpotifyApi.TrackObjectFull | null)[] =
            searchInResult.tracks.map((track) => track)
          return { ...item, tracks: albumTracks } as CustomAlbumObject
        }) as CustomAlbumObject[]
      } as CustomPagingArtistAlbumObject

      return { body: finalBody, statusCode }
    } else if (!spotifyApi && session) {
      if (session?.user && session.user.accessToken) {
        spotifyApiImported.setAccessToken(session.user.accessToken)
      }
      const { body, statusCode } = await spotifyApiImported.getArtistAlbums(
        artistId,
        { limit, offset }
      )
      if (statusCode !== 200) throw new SpotifyApiError(statusCode)
      if (!body.items || body.items.length === 0)
        return { body: undefined, statusCode: statusCode }

      const promises = body.items.map(async (item) => {
        const { body: albumTracksBody, statusCode: albumTracksStatusCode } =
          await getAlbumTracksById({
            albumId: item.id,
            spotifyApi: spotifyApiImported
          })
        if (albumTracksStatusCode !== 200 || !albumTracksBody) return null
        const fullTrackPromises = albumTracksBody.items.map(
          async (trackItem) => {
            const { body, statusCode } = await getTrackById({
              id: trackItem.id,
              spotifyApi: spotifyApiImported
            })
            if (!body || statusCode !== 200) return null
            return body
          }
        )
        const fullTrackObjects: (SpotifyApi.TrackObjectFull | null)[] =
          await Promise.all(fullTrackPromises)
        return { tracks: fullTrackObjects, albumId: item.id }
      })

      const resultsOfPromises = await Promise.all(promises)

      const finalBody: CustomPagingArtistAlbumObject = {
        ...body,
        items: body.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.albumId === item.id
          )
          if (!searchInResult) return null
          const albumTracks: (SpotifyApi.TrackObjectFull | null)[] =
            searchInResult.tracks.map((track) => track)
          return { ...item, tracks: albumTracks } as CustomAlbumObject
        }) as CustomAlbumObject[]
      } as CustomPagingArtistAlbumObject

      return { body: finalBody, statusCode }
    } else return { body: undefined, statusCode: 500 }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}
