import ArtistAlbumsPaginationStream from '@/components/ArtistAlbumsPaginationStream'
import { ArtistAlbumPaginationSkeleton } from '@/components/ui/Skeletons'
import { getAuthSession } from '@/lib/auth'
import {
  isCustomApiErrorObject,
  CustomErrorExceptionType,
  ApiStatusCodes
} from '@/lib/errors'
import spotifyApi from '@/lib/spotify'
import { getArtistById } from '@/services/artist'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

interface Props {
  params: {
    artistId: string
  }
}

export async function generateMetadata({ params }: Props) {
  const { artistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { body, statusCode, error } = await getArtistById({
    artistId,
    spotifyApi
  })
  if (!body || statusCode !== 200) {
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
    if (!body || statusCode === 404 || statusCode === 204) {
      notFound()
    }
    throw new CustomErrorExceptionType({
      statusCode: statusCode as ApiStatusCodes
    })
  }

  return {
    title: `Spotify - Albums of ${body.name}`
  }
}

export default async function Page({ params }: Props) {
  const { artistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  return (
    <section className='flex bg-zinc-900 flex-col md:px-6 px-4 flex-1 gap-4 md:pt-16 py-4'>
      <Suspense fallback={<ArtistAlbumPaginationSkeleton />}>
        <ArtistAlbumsPaginationStream
          artistId={artistId}
          session={session}
          spotifyApi={spotifyApi}
        />
      </Suspense>
    </section>
  )
}
