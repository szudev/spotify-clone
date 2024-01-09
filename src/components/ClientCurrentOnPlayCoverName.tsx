'use client'

import { cn } from '@/lib/utils'
import { currentTrackAtom } from '@/store/atoms/player-atom'
import { useAtomValue } from 'jotai'
import { OnPlayTypes } from './ClientCoverPlayer'

interface Props {
  name: string
  onPlay: OnPlayTypes
}

export default function ClientCurrentOnPlayCoverName({ name, onPlay }: Props) {
  const currentTrack = useAtomValue(currentTrackAtom)
  return (
    <strong
      className={cn('text-base block text-white truncate w-full', {
        'text-[#1ed760] md:text-white':
          (onPlay.playerType === 'album' &&
            onPlay.albumId === currentTrack?.albumId) ||
          (onPlay.playerType === 'playlist' &&
            onPlay.playlistId === currentTrack?.playlistId)
      })}
    >
      {name}
    </strong>
  )
}
