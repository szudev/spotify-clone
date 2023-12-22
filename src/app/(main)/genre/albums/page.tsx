import AlbumsList from '@/components/AlbumsList'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'
import { AlbumListSkeleton } from '@/components/ui/Skeletons'

export default async function Albums() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  return (
    <section className='flex flex-col md:px-6 px-4 flex-1 gap-4 md:pt-16 pt-4'>
      <div className='md:flex hidden items-center justify-start'>
        <p className='text-white text-xl font-semibold'>Albums</p>
      </div>
      <Suspense fallback={<AlbumListSkeleton />}>
        <AlbumsList spotifyApi={spotifyApi} />
      </Suspense>
    </section>
  )
}
