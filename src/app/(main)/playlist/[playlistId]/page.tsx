import PlaylistHeader from '@/components/PlaylistHeader'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { cn, formatSongDuration } from '@/lib/utils'
import { getPlaylistById } from '@/services/playlists'
import { getUserById } from '@/services/user'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  params: {
    playlistId: string
  }
}

export default async function Playlist({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  return (
    <section className='flex flex-col gap-6 px-6 pb-4 pt-16 min-h-full'>
      <Suspense
        fallback={
          <strong className='text-white font-bold animate-pulse text-6xl'>
            LOADING HEADER...
          </strong>
        }
      >
        <PlaylistHeader playlistId={playlistId} spotifyApi={spotifyApi} />
      </Suspense>
    </section>
  )
}
