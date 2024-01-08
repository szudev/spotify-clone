import { SearchAlbums } from '@/services/search'
import { Session } from 'next-auth'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import SearchAlbumPagination from './SearchAlbumPagination'

interface Props {
  queryParam: string
  spotifyApi: SpotifyWebApi
  session: Session | null
}

export default async function SearchAlbumPaginationStream({
  queryParam,
  session,
  spotifyApi
}: Props) {
  const { body, statusCode } = await SearchAlbums({
    queryParam,
    spotifyApi,
    limit: 5,
    offset: 0
  })

  if (statusCode !== 200) return notFound()
  return (
    <SearchAlbumPagination
      queryParam={queryParam}
      session={session}
      body={{ body, statusCode }}
    />
  )
}
