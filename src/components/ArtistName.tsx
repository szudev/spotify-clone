'use client'

import { headerTitleState } from '@/store/atoms/header-title-atom'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

export default function ArtistName({ artistName }: { artistName: string }) {
  const setHeaderTitle = useSetAtom(headerTitleState)
  useEffect(() => {
    setHeaderTitle(artistName)
  }, [])
  return (
    <h1 className='font-bold md:text-6xl text-white text-2xl'>{artistName}</h1>
  )
}
