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
    await signOut({ callbackUrl: `/login` })
  }

  return (
    <section className='flex flex-col gap-6 md:to-zinc-900 md:bg-gradient-to-b md:from-[#222222] md:px-6 px-4 pb-4 pt-2 md:pt-16 min-h-full bg-zinc-900'>
      <Suspense fallback={<RecentlyPlayedSkeleton />}>
        <RecentlyPlayed spotifyApi={spotifyApi} />
      </Suspense>
    </section>
  )
}
