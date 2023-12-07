import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import MainPlayer from './MainPlayer'
import { getUserPlaybackState } from '@/services/playback'

export default async function FooterContent() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode } = await getUserPlaybackState(spotifyApi)

  return (
    <section className='grid grid-cols-[30%_40%_30%] px-2 pb-[2px] pt-2 rounded-lg'>
      <MainPlayer
        accessToken={spotifyApi.getAccessToken()}
        body={body}
        statusCode={statusCode}
      />
    </section>
  )
}
