import PlaylistHeader from '@/components/PlaylistHeader'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'
import {
  PlaylistHeaderSkeleton,
  PlaylistTableSkeleton
} from '@/app/(main)/loading'
import PlaylistTable from '@/components/PlaylistTable'

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
    <section className='flex flex-col gap-6 pt-16 min-h-full'>
      <Suspense fallback={<PlaylistHeaderSkeleton />}>
        <PlaylistHeader playlistId={playlistId} spotifyApi={spotifyApi} />
      </Suspense>
      <div className='bg-gradient-to-b from-black/10 to-zinc-900 to-[200px] w-full flex-1'>
        <Suspense fallback={<PlaylistTableSkeleton />}>
          <PlaylistTable playlistId={playlistId} spotifyApi={spotifyApi} />
        </Suspense>
      </div>
    </section>
  )
}
