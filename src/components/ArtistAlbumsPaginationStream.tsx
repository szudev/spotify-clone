import { getArtistAlbumsPaginated } from '@/services/artist'
import { Session } from 'next-auth'
import SpotifyWebApi from 'spotify-web-api-node'
import ArtistAlbumsPagination from './ArtistAlbumsPagination'
import {
  isCustomApiErrorObject,
  CustomErrorExceptionType,
  ApiStatusCodes
} from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from './CustomTooManyRequestErrorBoundary'

interface Props {
  artistId: string
  spotifyApi: SpotifyWebApi
  session: Session | null
}

export default async function ArtistAlbumsPaginationStream({
  artistId,
  spotifyApi,
  session
}: Props) {
  const { body, statusCode, error } = await getArtistAlbumsPaginated({
    artistId,
    spotifyApi,
    limit: 5,
    offset: 0
  })

  if (statusCode !== 200) {
    if (statusCode === 429) {
      if (isCustomApiErrorObject(error)) {
        const retryAfter = error.headers['retry-after']
          ? parseInt(error.headers['retry-after'], 10)
          : undefined
        return (
          <CustomTooManyRequestErrorBoundary
            statusCode={statusCode}
            retryAfter={retryAfter}
          />
        )
      } else {
        return <CustomTooManyRequestErrorBoundary statusCode={statusCode} />
      }
    }
    throw new CustomErrorExceptionType({
      statusCode: statusCode as ApiStatusCodes
    })
  }

  return (
    <ArtistAlbumsPagination
      artistId={artistId}
      body={{ body, statusCode }}
      session={session}
    />
  )
}
