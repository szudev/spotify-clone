import { ApiStatusCodes, spotifyWebApiErrorHandler } from '@/lib/errors'
import spotifyApiImported from '@/lib/spotify'
import { Session } from 'next-auth'
import SpotifyWebApi from 'spotify-web-api-node'
import { getPlaylistTracksById } from './playlists'
import { getAlbumById, getAlbumTracksById } from './album'
import { getTrackById } from './track'

class SpotifyApiError extends Error {
  statusCode: number

  constructor(statusCode: number) {
    super()
    this.name = 'SpotifyApiError'
    this.statusCode = statusCode
  }
}

interface SearchResultsProps {
  queryParam: string
  spotifyApi: SpotifyWebApi
  withArtists?: boolean
  withTracks?: boolean
  limit?: number
  offset?: number
}

type SearchGenreProps = Pick<SearchResultsProps, 'queryParam'> & {
  session?: Session | null
  limit: number
  offset: number
  spotifyApi?: SpotifyWebApi
}

export async function SearchResults({
  queryParam,
  spotifyApi,
  limit,
  offset,
  withArtists,
  withTracks
}: SearchResultsProps) {
  try {
    const { body, statusCode } = await spotifyApi.search(
      queryParam,
      withArtists === true && withTracks === true
        ? ['playlist', 'album', 'artist', 'track']
        : ['playlist', 'album'],
      { limit: limit ?? 5, offset: offset ?? 0 }
    )
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
export type CustomPagingPlaylistObject =
  SpotifyApi.PagingObject<CustomPlaylistObject>

type CustomPlaylistObject = SpotifyApi.PlaylistObjectSimplified & {
  tracks: (SpotifyApi.TrackObjectFull | null)[]
}

export type SearchPlaylistsReturnType = {
  body?: CustomPagingPlaylistObject
  statusCode: ApiStatusCodes
}

export async function SearchPlaylists({
  queryParam,
  spotifyApi,
  session,
  limit,
  offset
}: SearchGenreProps): Promise<SearchPlaylistsReturnType> {
  try {
    if (spotifyApi && !session) {
      const { body: searchBody, statusCode: searchStatusCode } =
        await spotifyApi.search(queryParam, ['playlist'], { limit, offset })
      if (searchStatusCode !== 200) throw new SpotifyApiError(searchStatusCode)
      if (!searchBody.playlists || searchBody.playlists.items.length === 0)
        return { body: undefined, statusCode: searchStatusCode }

      const promises = searchBody.playlists.items.map(async (item) => {
        const {
          body: playlistTracksBody,
          statusCode: playlistTracksStatusCode
        } = await getPlaylistTracksById({ playlistId: item.id, spotifyApi })
        if (playlistTracksStatusCode !== 200 || !playlistTracksBody) return null
        return { body: playlistTracksBody.items, playlistId: item.id }
      })

      const resultsOfPromises = await Promise.all(promises)

      const finalBody: CustomPagingPlaylistObject = {
        ...searchBody.playlists,
        items: searchBody.playlists.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.playlistId === item.id
          )
          if (!searchInResult) return null
          const playlistTracks = searchInResult.body.map((track) => track.track)
          return { ...item, tracks: playlistTracks } as CustomPlaylistObject
        }) as CustomPlaylistObject[]
      } as CustomPagingPlaylistObject

      return { body: finalBody, statusCode: searchStatusCode }
    } else if (!spotifyApi && session) {
      if (session?.user && session.user.accessToken) {
        spotifyApiImported.setAccessToken(session.user.accessToken)
      }
      const { body: searchBody, statusCode: searchStatusCode } =
        await spotifyApiImported.search(queryParam, ['playlist'], {
          limit,
          offset
        })
      if (searchStatusCode !== 200) throw new SpotifyApiError(searchStatusCode)
      if (!searchBody.playlists || searchBody.playlists.items.length === 0)
        return { body: undefined, statusCode: searchStatusCode }

      const promises = searchBody.playlists.items.map(async (item) => {
        const {
          body: playlistTracksBody,
          statusCode: playlistTracksStatusCode
        } = await getPlaylistTracksById({
          playlistId: item.id,
          spotifyApi: spotifyApiImported
        })
        if (playlistTracksStatusCode !== 200 || !playlistTracksBody) return null
        return { body: playlistTracksBody.items, playlistId: item.id }
      })

      const resultsOfPromises = await Promise.all(promises)

      const finalBody: CustomPagingPlaylistObject = {
        ...searchBody.playlists,
        items: searchBody.playlists.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.playlistId === item.id
          )
          if (!searchInResult) return null
          const playlistTracks = searchInResult.body.map((track) => track.track)
          return { ...item, tracks: playlistTracks } as CustomPlaylistObject
        }) as CustomPlaylistObject[]
      } as CustomPagingPlaylistObject

      return { body: finalBody, statusCode: searchStatusCode }
    } else return { body: undefined, statusCode: 500 }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}

export type CustomPagingAlbumObject = SpotifyApi.PagingObject<CustomAlbumObject>

type CustomAlbumObject = SpotifyApi.AlbumObjectSimplified & {
  tracks: (SpotifyApi.TrackObjectFull | null)[]
}

export type SearchAlbumReturnType = {
  body?: CustomPagingAlbumObject
  statusCode: ApiStatusCodes
}

export async function SearchAlbums({
  queryParam,
  spotifyApi,
  session,
  limit,
  offset
}: SearchGenreProps): Promise<SearchAlbumReturnType> {
  try {
    if (spotifyApi && !session) {
      const { body: searchBody, statusCode: searchStatusCode } =
        await spotifyApi.search(queryParam, ['album'], { limit, offset })
      if (searchStatusCode !== 200) throw new SpotifyApiError(searchStatusCode)
      if (!searchBody.albums || searchBody.albums.items.length === 0)
        return { body: undefined, statusCode: searchStatusCode }

      const promises = searchBody.albums.items.map(async (item) => {
        const { body: albumTracksBody, statusCode: albumTracksStatusCode } =
          await getAlbumTracksById({ albumId: item.id, spotifyApi })
        if (albumTracksStatusCode !== 200 || !albumTracksBody) return null
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

      const finalBody: CustomPagingAlbumObject = {
        ...searchBody.albums,
        items: searchBody.albums.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.albumId === item.id
          )
          if (!searchInResult) return null
          const albumTracks: (SpotifyApi.TrackObjectFull | null)[] =
            searchInResult.tracks.map((track) => track)
          return { ...item, tracks: albumTracks } as CustomAlbumObject
        }) as CustomAlbumObject[]
      } as CustomPagingAlbumObject

      return { body: finalBody, statusCode: searchStatusCode }
    } else if (!spotifyApi && session) {
      if (session?.user && session.user.accessToken) {
        spotifyApiImported.setAccessToken(session.user.accessToken)
      }
      const { body: searchBody, statusCode: searchStatusCode } =
        await spotifyApiImported.search(queryParam, ['album'], {
          limit,
          offset
        })
      if (searchStatusCode !== 200) throw new SpotifyApiError(searchStatusCode)
      if (!searchBody.albums || searchBody.albums.items.length === 0)
        return { body: undefined, statusCode: searchStatusCode }

      const promises = searchBody.albums.items.map(async (item) => {
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

      const finalBody: CustomPagingAlbumObject = {
        ...searchBody.albums,
        items: searchBody.albums.items.map((item) => {
          const searchInResult = resultsOfPromises.find(
            (result) => result?.albumId === item.id
          )
          if (!searchInResult) return null
          const albumTracks: (SpotifyApi.TrackObjectFull | null)[] =
            searchInResult.tracks.map((track) => track)
          return { ...item, tracks: albumTracks } as CustomAlbumObject
        }) as CustomAlbumObject[]
      } as CustomPagingAlbumObject

      return { body: finalBody, statusCode: searchStatusCode }
    } else return { body: undefined, statusCode: 500 }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
