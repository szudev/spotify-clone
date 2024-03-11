import CustomTooManyRequestErrorBoundary from '@/components/CustomTooManyRequestErrorBoundary'
import { getAuthSession } from '@/lib/auth'
import {
  ApiStatusCodes,
  apiStatusDescriptions,
  isCustomApiErrorObject
} from '@/lib/errors'
import spotifyApi from '@/lib/spotify'
import { getPlaylistById } from '@/services/playlists'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    playlistId: string
  }
  children: React.ReactNode
  title: React.ReactNode
  table: React.ReactNode
}

/* export async function generateMetadata({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode } = await getPlaylistById({
    playlistId,
    spotifyApi,
    fields: 'id,name'
  })

  if (statusCode === 404) {
    notFound()
  }

  return {
    title:
      body && statusCode === 200
        ? `${body.name} | Spotify playlist`
        : `${
            apiStatusDescriptions[statusCode as ApiStatusCodes]
              ? apiStatusDescriptions[statusCode as ApiStatusCodes]
              : 'Error'
          } | Spotify`
  }
} */

export const metadata: Metadata = {
  title: 'Spotify playlist',
  description: 'Spotify playlist page.'
}

export default async function PlaylistLayout({ params, title, table }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const { body, statusCode, error } = await getPlaylistById({
    playlistId,
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
    <section className='flex flex-col gap-6 pt-16 flex-1 rounded-t-lg'>
      {title}
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
        {table}
      </div>
    </section>
  )
}
