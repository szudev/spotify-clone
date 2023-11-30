import RecentlyPlayedFullList from '@/components/RecentlyPlayedFullList'
import { Suspense } from 'react'
import { RecentlyPlayedFullListSkeleton } from '../../loading'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'

export default async function RecentlyPlayed() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-start'>
        <p className='text-white text-xl font-semibold'>Recently played</p>
      </div>
      <Suspense fallback={<RecentlyPlayedFullListSkeleton />}>
        <RecentlyPlayedFullList spotifyApi={spotifyApi} />
      </Suspense>
    </section>
  )
}
