import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import UserPlaylists from './UserPlaylists'
import { signOut } from 'next-auth/react'
import { getUserPlayLists2 } from '@/services/playlists'

export default async function UserPlaylistsStream() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  } else {
    await signOut({ callbackUrl: `${window.location.origin}/login` })
  }
  const { body, statusCode } = await getUserPlayLists2({ spotifyApi })

  if (statusCode === 401 || !body)
    return await signOut({ callbackUrl: `${window.location.origin}/login` })

  return <UserPlaylists body={body} session={session} />
}
