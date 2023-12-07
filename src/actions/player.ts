'use server'

import { getAuthSession } from '@/lib/auth'
import { spotifyWebApiErrorHandler } from '@/lib/errors'
import spotifyApi from '@/lib/spotify'

export const playSong = async (
  track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObject,
  deviceId: string,
  position_ms: number
) => {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  try {
    const { body } = await spotifyApi.getMyDevices()
    if (body.devices.length === 0) throw new Error('NO DEVICES FOUND.')
    return await spotifyApi.play({
      uris: [track.uri],
      device_id: deviceId,
      position_ms: position_ms
    })
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}

export const pauseSong = async (deviceId: string) => {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  try {
    return await spotifyApi.pause({
      device_id: deviceId
    })
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
