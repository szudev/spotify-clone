import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import UserPlaylists from './UserPlaylists'
import { getUserPlayLists2 } from '@/services/playlists'
import {
  CustomErrorExceptionType,
  ApiStatusCodes,
  isCustomApiErrorObject
} from '@/lib/errors'
import LayoutRetryAfterErrorBoundary from './LayoutRetryAfterErrorBoundary'

export default async function UserPlaylistsStream() {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode, error } = await getUserPlayLists2({ spotifyApi })

  if (statusCode !== 200 || !body) {
    if (statusCode === 429) {
      //SHOW RETRY AFTER X TIME BUTTON
      if (isCustomApiErrorObject(error)) {
        return (
          <LayoutRetryAfterErrorBoundary
            retryAfter={
              error.headers['retry-after']
                ? parseInt(error.headers['retry-after'], 10)
                : 0
            }
          />
        )
      } else return <LayoutRetryAfterErrorBoundary retryAfter={0} />
    }
    if (!body && statusCode === 204) {
      //SHOW NO CONTENT FOR THE USER
      return null
    }
    //THROW A CUSTOM ERROR TO TRIGGER THE GLOBAL-ERROR FILE
    //IN THIS CASE, THE STATUSCODE AND ERROR MESSAGE DOESNT MATTER
    //GLOBAL-ERROR FILE DOESNT EXPOSE ANY DATA OF THE ERROR OBJECT
    throw new CustomErrorExceptionType({
      statusCode: statusCode as ApiStatusCodes
    })
  }

  return <UserPlaylists body={body} session={session} />
}
