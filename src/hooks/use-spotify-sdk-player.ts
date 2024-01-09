import {
  playerSdkAtom,
  deviceIdAtom,
  isPlayingAtom,
  currentTrackAtom
} from '@/store/atoms/player-atom'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

interface Props {
  accessToken: string | undefined
}

export default function useSpotifySdkPlayer({ accessToken }: Props) {
  const [playerSdk, setPlayerSdk] = useAtom(playerSdkAtom)
  const setIsPlaying = useSetAtom(isPlayingAtom)
  const setDeviceId = useSetAtom(deviceIdAtom)
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true

    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Spotify-Clone Web Browser',
        getOAuthToken: (cb) => {
          cb(accessToken as string)
        },
        volume: 0.5
      })

      setPlayerSdk(player)

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id)
      })

      player.addListener('player_state_changed', ({ timestamp, paused }) => {
        if (paused) {
          setIsPlaying(false)
        } else setIsPlaying(true)
        if (currentTrack && timestamp !== currentTrack.progress_ms) {
          setCurrentTrack((prev) => ({
            ...prev!,
            progress_ms: timestamp
          }))
        }
      })

      player.addListener('not_ready', ({ device_id }) => {
        player.disconnect()
        console.log({ location: 'not_ready Listener.' })
        setPlayerSdk(undefined)
      })

      player.connect().then((success) => {
        if (success)
          console.log('The Web Playback SDK successfully connected to Spotify!')
      })
    }
  }, [])

  return { playerSdk }
}
