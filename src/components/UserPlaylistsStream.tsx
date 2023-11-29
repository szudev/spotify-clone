import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import UserPlaylists from './UserPlaylists'

export default async function UserPlaylistsStream() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { body } = await spotifyApi.getUserPlaylists({ limit: 4 })

  return <UserPlaylists body={body} session={session} />
}
