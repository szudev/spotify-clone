import RecentlyPlayed from '@/components/RecentlyPlayed'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'
import { RecentlyPlayedSkeleton } from './loading'
import { signOut } from 'next-auth/react'

export default async function Home() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  } else {
    await signOut({ callbackUrl: `${window.location.origin}/login` })
  }

  return (
    <section className='flex flex-col gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] px-6 pb-4 pt-16 min-h-full'>
      <Suspense fallback={<RecentlyPlayedSkeleton />}>
        <RecentlyPlayed spotifyApi={spotifyApi} />
      </Suspense>
    </section>
  )
}
