import { SearchPlaylists } from '@/services/search'
import SearchPlaylistPagination from './SearchPlaylistPagination'
import SpotifyWebApi from 'spotify-web-api-node'
import { Session } from 'next-auth'
import { notFound } from 'next/navigation'
import { isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from './CustomTooManyRequestErrorBoundary'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
  session: Session | null
}

export default async function SearchPlaylistPaginationStream({
  queryParam,
  spotifyApi,
  session
}: Props) {
  const { body, statusCode, error } = await SearchPlaylists({
    queryParam,
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
    throw new Error('An error occurred.')
  }

  return (
    <SearchPlaylistPagination
      queryParam={queryParam}
      session={session}
      body={{ body, statusCode }}
    />
  )
}
