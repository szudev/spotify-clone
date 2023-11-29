import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { getPlaylistById } from '@/services/playlists'
import { notFound } from 'next/navigation'

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
  const response = await getPlaylistById({ playlistId, spotifyApi })
  if (!response || response.statusCode !== 200) return notFound()
  return (
    <section className='flex flex-col gap-6 px-6 pb-4 pt-16 min-h-full'>
      <p className='text-white'>{response?.body.name}</p>
    </section>
  )
}
