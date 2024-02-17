import { getArtistAlbumsPaginated } from '@/services/artist'
import { Session } from 'next-auth'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import ArtistAlbumsPagination from './ArtistAlbumsPagination'

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

  if (statusCode !== 200) return notFound()

  return (
    <ArtistAlbumsPagination
      artistId={artistId}
      body={{ body, statusCode }}
      session={session}
    />
  )
}
