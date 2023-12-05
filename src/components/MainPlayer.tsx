'use client'

import { useEffect } from 'react'
import {
  EnableRepeatIcon,
  PlayBeforeIcon,
  PlayIcon,
  PlayNextIcon,
  RandomOffModeIcon
} from './Icons'
import useSpotifySdkPlayer from '@/hooks/use-spotify-sdk-player'

interface Props {
  accessToken: string | undefined
}

export default function MainPlayer({ accessToken }: Props) {
  const { playerSdk } = useSpotifySdkPlayer({ accessToken })

  return (
    <div className='flex gap-6 items-center justify-center'>
      <RandomOffModeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
      <PlayBeforeIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
      <button className='rounded-full bg-white p-2 flex items-center justify-center'>
        <PlayIcon className='h-4 w-4' />
      </button>
      <PlayNextIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
      <EnableRepeatIcon className='h-4 w-4 fill-zinc-400 hover:fill-white' />
    </div>
  )
}
