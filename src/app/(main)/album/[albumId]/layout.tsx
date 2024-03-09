import CustomTooManyRequestErrorBoundary from '@/components/CustomTooManyRequestErrorBoundary'
import { getAuthSession } from '@/lib/auth'
import {
  ApiStatusCodes,
  apiStatusDescriptions,
  isCustomApiErrorObject
} from '@/lib/errors'
import spotifyApi from '@/lib/spotify'
import { getAlbumById } from '@/services/album'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    albumId: string
  }
  children: React.ReactNode
  title: React.ReactNode
  table: React.ReactNode
}

export async function generateMetadata({ params }: Props) {
  const { albumId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode } = await getAlbumById({
    albumId,
    spotifyApi
  })

  if (statusCode === 404) {
    notFound()
  }

  return {
    title:
      body && statusCode === 200
        ? `${body.name} | Spotify ${body.type ?? 'album'}`
        : `${
            apiStatusDescriptions[statusCode as ApiStatusCodes]
              ? apiStatusDescriptions[statusCode as ApiStatusCodes]
              : 'Error'
          } | Spotify`
  }
}

export default async function AlbumLayout({ params, table, title }: Props) {
  const { albumId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode, error } = await getAlbumById({
    albumId,
    spotifyApi
  })

  if (!body || statusCode !== 200) {
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
    if (statusCode === 404) {
      notFound()
    }
    if (!body || statusCode === 204) {
      return (
        <div className='flex flex-col items-center justify-center gap-6 bg-zinc-900 pt-16 flex-1'>
          <p className='text-zinc-400'>No content were found.</p>
        </div>
      )
    }

    throw new Error(`${apiStatusDescriptions[statusCode as ApiStatusCodes]}`)
  }

  return (
    <section className='flex flex-col gap-6 bg-transparent pt-16 flex-1 rounded-t-lg'>
      {title}
      {table}
    </section>
  )
}
