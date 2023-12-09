import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import UserPlaylists from './UserPlaylists'
import { getUserPlayLists2 } from '@/services/playlists'
import { redirect } from 'next/navigation'

export default async function UserPlaylistsStream() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  } else {
    return redirect('/login')
  }
  const { body, statusCode } = await getUserPlayLists2({ spotifyApi })

  if (statusCode === 401 || !body) return redirect('/login')

  return <UserPlaylists body={body} session={session} />
}
