'use client'

import { useState } from 'react'
import { Button } from './Button'
import { signIn } from 'next-auth/react'
import { SpotifyIcon } from './Icons'

export function LoginProviders() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const loginWithSpotify = async () => {
    setIsLoading(true)
    try {
      await signIn('spotify', { callbackUrl: '/' })
    } catch (error) {
      window.alert(error)
      /* toast({
            title: 'An error occurred',
            description: 'There was an error login with Spotify',
            variant: 'destructive'
          }) */
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ul className='list-none flex flex-col gap-2'>
      <li>
        <Button
          className='py-3 px-[31px] hover:border-white focus:outline-white focus:border-white flex items-center justify-between gap-4 text-white border border-[#878787] rounded-full font-bold'
          isLoading={isLoading}
          onClick={loginWithSpotify}
          aria-label='Login with your Spotify Account'
        >
          <SpotifyIcon className='h-6 w-6' /> Continue with Spotify
        </Button>
      </li>
    </ul>
  )
}
