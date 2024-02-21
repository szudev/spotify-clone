import { getArtistAlbumsPaginated } from '@/services/artist'
import { Session } from 'next-auth'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import ArtistAlbumsPagination from './ArtistAlbumsPagination'
import {
  isCustomApiErrorObject,
  CustomErrorExceptionType,
  ApiStatusCodes
} from '@/lib/errors'

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
        throw new CustomErrorExceptionType({
          statusCode: statusCode as ApiStatusCodes,
          retryAfter: error.headers['retry-after']
            ? parseInt(error.headers['retry-after'], 10)
            : undefined
        })
      } else {
        throw new CustomErrorExceptionType({
          statusCode: statusCode as ApiStatusCodes
        })
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
