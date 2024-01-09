import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import MainPlayer from './MainPlayer'
import { getUserPlaybackState } from '@/services/playback'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

export default async function FooterContent() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode } = await getUserPlaybackState(spotifyApi)

  if (statusCode === 401) return redirect('/login')

  const MobileMenu = dynamic(() => import('@/components/MobileMenu'), {
    ssr: false
  })

  return (
    <section className='flex flex-col gap-2 md:gap-0 px-2 md:pb-[2px] pb-2 pt-2 rounded-lg'>
      <MainPlayer
        accessToken={spotifyApi.getAccessToken()}
        body={body}
        statusCode={statusCode}
      />
      <MobileMenu />
    </section>
  )
}
