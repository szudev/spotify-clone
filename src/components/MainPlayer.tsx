'use client'

import { useAtomValue } from 'jotai'
import {
  EnableRepeatIcon,
  PlayBeforeIcon,
  PlayIcon,
  PlayNextIcon,
  RandomOffModeIcon
} from './Icons'
import useSpotifySdkPlayer from '@/hooks/use-spotify-sdk-player'
import { currentTrackAtom, deviceIdAtom } from '@/store/atoms/player-atom'
import { playSong } from '@/actions/player'
import { Slider } from './ui/slider'

interface Props {
  accessToken: string | undefined
}

export default function MainPlayer({ accessToken }: Props) {
  useSpotifySdkPlayer({ accessToken })
  const deviceId = useAtomValue(deviceIdAtom)
  const currentTrackId = useAtomValue(currentTrackAtom)

  const handlePlay = async () => {
    if (deviceId === undefined || currentTrackId === undefined) return
    await playSong(currentTrackId, deviceId)
  }

  return (
    <div className='flex flex-col items-center justify-between'>
      <div className='flex gap-6 items-center justify-center'>
        <button className='group' disabled={true}>
          <RandomOffModeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
        </button>
        <button className='group' disabled={true}>
          <PlayBeforeIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
        </button>
        <button
          onClick={handlePlay}
          disabled={true}
          className='rounded-full disabled:bg-[#4D4D4D] bg-white p-2 flex items-center justify-center'
        >
          <PlayIcon className='h-4 w-4' />
        </button>
        <button className='group' disabled={true}>
          <PlayNextIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
        </button>
        <button className='group' disabled={true}>
          <EnableRepeatIcon className='h-4 w-4 fill-zinc-400 group-disabled:fill-[#4D4D4D] hover:fill-white' />
        </button>
      </div>
      <div className='grid w-full grid-cols-[minmax(20px,auto)_1fr_minmax(20px,auto)] gap-2 items-center justify-center'>
        <div className='flex justify-end items-center text-zinc-400 text-sm'>
          0:00
        </div>
        <div className='w-full flex relative flex-col group'>
          <p className='invisible text-xs'>Hidden Text</p>
          <Slider
            defaultValue={[0]}
            max={100}
            min={0}
            step={1}
            className='top-1/2 group left-1/2 absolute -translate-y-1/2 -translate-x-1/2'
          />
        </div>
        <div className='flex justify-start items-center text-zinc-400 text-sm'>
          0:00
        </div>
      </div>
    </div>
  )
}
