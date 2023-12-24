'use client'

import { headerTitleState } from '@/store/atoms/header-title-atom'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export default function AlbumName({ albumName }: { albumName: string }) {
  const setHeaderTitle = useSetAtom(headerTitleState)
  useEffect(() => {
    setHeaderTitle(albumName)
  }, [])
  return (
    <h1 className='font-bold md:text-6xl text-white text-2xl'>{albumName}</h1>
  )
}
