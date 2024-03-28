import {
  playerSdkAtom,
  deviceIdAtom,
  isPlayingAtom,
  currentTrackAtom,
  playerErrorAtom,
  errorDescriptions
} from '@/store/atoms/player-atom'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { toast } from './use-toast'

interface Props {
  accessToken: string | undefined
}

export default function useSpotifySdkPlayer({ accessToken }: Props) {
  const [playerSdk, setPlayerSdk] = useAtom(playerSdkAtom)
  const setIsPlaying = useSetAtom(isPlayingAtom)
  const setDeviceId = useSetAtom(deviceIdAtom)
  const [currentTrack, setCurrentTrack] = useAtom(currentTrackAtom)
  const setPlayerError = useSetAtom(playerErrorAtom)

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

      player.on('authentication_error', () => {
        setPlayerError({
          errorType: 'authentication_error',
          description: errorDescriptions['authentication_error']
        })
        toast({
          title: 'Authentication error',
          description:
            'Spotify Player fails to instantiate a valid Spotify connection.',
          variant: 'destructive'
        })
      })

      player.on('account_error', () => {
        setPlayerError({
          errorType: 'account_error',
          description: errorDescriptions['account_error']
        })
        toast({
          title: 'Premium required',
          description:
            'An spotify premmium account is required to use the player.',
          variant: 'warning'
        })
      })

      player.on('initialization_error', ({ message }) => {
        setPlayerError({
          errorType: 'initialization_error',
          description: errorDescriptions['initialization_error']
        })
        toast({
          title: 'Player Initialization Error',
          description:
            message ??
            'Failed to instantiate a player capable of playing content in the current environment.',
          variant: 'destructive'
        })
      })

      player.on('playback_error', () => {
        setPlayerError({
          errorType: 'playback_error',
          description: errorDescriptions['playback_error']
        })
        toast({
          title: 'Playback error',
          description: 'Error to perform playback.',
          variant: 'destructive'
        })
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
        console.log('HERE!!!')
        player.disconnect()
        toast({
          title: 'Error',
          description: 'The Web Playback SDK could not connect to Spotify!',
          variant: 'destructive'
        })
        setPlayerSdk(undefined)
      })

      player.connect().then((success) => {
        if (success)
          toast({
            title: 'Spotify SDK ready',
            description:
              'The Web Playback SDK was successfully connected to Spotify!',
            variant: 'success'
          })
      })
    }
  }, [])

  return { playerSdk }
}
