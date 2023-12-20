import PlaylistHeader from '@/components/PlaylistHeader'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'
import {
  PlaylistHeaderSkeleton,
  PlaylistTableSkeleton
} from '@/app/(main)/loading'
import PlaylistTable from '@/components/PlaylistTable'
import { getPlaylistById } from '@/services/playlists'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    playlistId: string
  }
}

export async function generateMetadata({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const playlistResponse = await getPlaylistById({ playlistId, spotifyApi })
  if (!playlistResponse || playlistResponse.statusCode !== 200)
    return notFound()

  return {
    title: `${playlistResponse.body.name} | Spotify ${playlistResponse.body.type}`
  }
}

export default async function Playlist({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  return (
    <section className='flex flex-col gap-6 pt-16 min-h-full flex-1'>
      <Suspense fallback={<PlaylistHeaderSkeleton />}>
        <PlaylistHeader playlistId={playlistId} spotifyApi={spotifyApi} />
      </Suspense>
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
        <Suspense fallback={<PlaylistTableSkeleton />}>
          <PlaylistTable playlistId={playlistId} spotifyApi={spotifyApi} />
        </Suspense>
      </div>
    </section>
  )
}
