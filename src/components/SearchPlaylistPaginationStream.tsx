import { SearchPlaylists } from '@/services/search'
import SearchPlaylistPagination from './SearchPlaylistPagination'
import SpotifyWebApi from 'spotify-web-api-node'
import { Session } from 'next-auth'
import { notFound } from 'next/navigation'

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
  const { body, statusCode } = await SearchPlaylists({
    queryParam,
    spotifyApi,
    limit: 5,
    offset: 0
  })

  if (statusCode !== 200) return notFound()
  return (
    <SearchPlaylistPagination
      queryParam={queryParam}
      session={session}
      body={{ body, statusCode }}
    />
  )
}
