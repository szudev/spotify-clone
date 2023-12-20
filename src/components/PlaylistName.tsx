'use client'

import { headerTitleState } from '@/store/atoms/header-title-atom'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export default function PlaylistName({
  playlistName
}: {
  playlistName: string
}) {
  const setHeaderTitle = useSetAtom(headerTitleState)
  useEffect(() => {
    setHeaderTitle(playlistName)
  }, [])
  return (
    <h1 className='font-bold md:text-6xl text-white text-2xl'>
      {playlistName}
    </h1>
  )
}
