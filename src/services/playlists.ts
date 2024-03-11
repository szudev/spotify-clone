import { spotifyWebApiErrorHandler } from '@/lib/errors'
import spotifyApi from '@/lib/spotify'
import { Session } from 'next-auth'
import { cache } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'

interface Props {
  pageParam?: number
  session: Session | null
}

interface GetUserPlayListsProps {
  pageParam?: number
  spotifyApi: SpotifyWebApi
}

export async function getUserPlayLists({
  pageParam = 4,
  session
}: Props): Promise<SpotifyApi.ListOfUsersPlaylistsResponse> {
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { body } = await spotifyApi.getUserPlaylists({
    limit: 4,
    offset: pageParam
  })
  return body
}

export async function getUserPlayLists2({
  spotifyApi,
  pageParam = 0
}: GetUserPlayListsProps) {
  try {
    const { body, statusCode } = await spotifyApi.getUserPlaylists({
      limit: 4,
      offset: pageParam
    })
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}

export async function getPlaylistById({
  playlistId,
  spotifyApi,
  fields
}: {
  playlistId: string
  spotifyApi: SpotifyWebApi
  fields?: string
}) {
  try {
    const { body, statusCode } = await spotifyApi.getPlaylist(playlistId, {
      fields
    })
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}

export const cachedGetPlaylistById = cache(
  async ({
    playlistId,
    spotifyApi
  }: {
    playlistId: string
    spotifyApi: SpotifyWebApi
  }) => {
    try {
      const { body, statusCode } = await spotifyApi.getPlaylist(playlistId)
      return { body, statusCode }
    } catch (error) {
      return { statusCode: spotifyWebApiErrorHandler(error), error }
    }
  }
)

export async function getPlaylistTracksById({
  playlistId,
  spotifyApi
}: {
  playlistId: string
  spotifyApi: SpotifyWebApi
}) {
  try {
    const { body, statusCode } = await spotifyApi.getPlaylistTracks(
      playlistId
      //{ limit: 4, offset: 0 }
    )
    return { body, statusCode }
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error), error }
  }
}
