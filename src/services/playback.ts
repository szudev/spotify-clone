import { spotifyWebApiErrorHandler } from '@/lib/errors'
import SpotifyWebApi from 'spotify-web-api-node'
import spotifyApi from '@/lib/spotify'

interface SetVolumeProps {
  volume: number
  api?: SpotifyWebApi
  accessToken?: string
  deviceId: string
}

interface SeekToPositionProps {
  positionMs: number
  api?: SpotifyWebApi
  accessToken?: string
  deviceId: string
}

export async function getUserPlaybackState(
  api?: SpotifyWebApi,
  accessToken?: string
) {
  try {
    if (!api && accessToken) {
      spotifyApi.setAccessToken(accessToken)
      const { body, statusCode } = await spotifyApi.getMyCurrentPlaybackState()
      return { body, statusCode }
    } else if (api) {
      const { body, statusCode } = await api.getMyCurrentPlaybackState()
      return { body, statusCode }
    } else throw new Error()
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}

export async function setPlaybackVolume({
  volume,
  api,
  accessToken,
  deviceId
}: SetVolumeProps) {
  try {
    if (!api && accessToken) {
      spotifyApi.setAccessToken(accessToken)
      const { statusCode } = await spotifyApi.setVolume(volume, {
        device_id: deviceId
      })
      return { statusCode }
    } else if (api) {
      const { statusCode } = await api.setVolume(volume, {
        device_id: deviceId
      })
      return { statusCode }
    } else throw new Error()
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}

export async function seekToPosition({
  deviceId,
  positionMs,
  accessToken,
  api
}: SeekToPositionProps) {
  try {
    if (!api && accessToken) {
      spotifyApi.setAccessToken(accessToken)
      const { statusCode } = await spotifyApi.seek(positionMs, {
        device_id: deviceId
      })
      return { statusCode }
    } else if (api) {
      const { statusCode } = await api.seek(positionMs, {
        device_id: deviceId
      })
      return { statusCode }
    } else throw new Error()
  } catch (error) {
    return { statusCode: spotifyWebApiErrorHandler(error) }
  }
}
