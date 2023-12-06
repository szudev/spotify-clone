'use server'

import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'

export const playSong = async (
  track: SpotifyApi.TrackObjectFull,
  deviceId: string
) => {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  try {
    const { body } = await spotifyApi.getMyDevices()
    if (body.devices.length === 0) throw new Error('NO DEVICES FOUND.')
    await spotifyApi.play({
      uris: [track.uri],
      device_id: deviceId
    })
  } catch (error) {
    if (error instanceof Error) console.log({ MESSAGE: error.message })
  }
}

export const pauseSong = async () => {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  try {
    const { body } = await spotifyApi.getMyDevices()
    if (body.devices.length === 0) throw new Error('NO DEVICES FOUND.')
    await spotifyApi.pause({
      device_id: body.devices.find((device) => device.id !== null)?.id as string
    })
  } catch (error) {
    if (error instanceof Error) console.log({ MESSAGE: error.message })
  }
}
