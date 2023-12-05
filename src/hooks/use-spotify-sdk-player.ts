import { playerSdkAtom } from '@/store/atoms/player-atom'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

interface Props {
  accessToken: string | undefined
}

export default function useSpotifySdkPlayer({ accessToken }: Props) {
  const [playerSdk, setPlayerSdk] = useAtom(playerSdkAtom)
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
        console.log('Ready with Device ID', device_id)
      })

      player.addListener('not_ready', ({ device_id }) => {
        player.disconnect()
        setPlayerSdk(undefined)
        console.log('Device ID has gone offline', device_id)
      })

      player.connect().then((success) => {
        if (success)
          console.log('The Web Playback SDK successfully connected to Spotify!')
      })
    }
  }, [])

  return { playerSdk }
}
