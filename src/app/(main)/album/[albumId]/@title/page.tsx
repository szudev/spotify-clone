import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { getAlbumById } from '@/services/album'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArtistById } from '@/services/artist'
import {
  formatPlaylistTotalDuration,
  hasMillisecondProperty
} from '@/lib/utils'
import Link from 'next/link'
import { isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestErrorBoundary from '@/components/CustomTooManyRequestErrorBoundary'

interface Props {
  params: {
    albumId: string
  }
}

export default async function AlbumTitle({ params }: Props) {
  const { albumId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const {
    body: albumBody,
    statusCode: albumStatusCode,
    error
  } = await getAlbumById({
    albumId,
    spotifyApi
  })

  if (!albumBody || albumStatusCode !== 200) {
    if (albumStatusCode === 429) {
      if (isCustomApiErrorObject(error)) {
        const retryAfter = error.headers['retry-after']
          ? parseInt(error.headers['retry-after'], 10)
          : undefined
        return (
          <CustomTooManyRequestErrorBoundary
            statusCode={albumStatusCode}
            retryAfter={retryAfter}
          />
        )
      } else {
        return (
          <CustomTooManyRequestErrorBoundary statusCode={albumStatusCode} />
        )
      }
    }
    if (!albumBody || albumStatusCode === 404 || albumStatusCode === 204) {
      notFound()
    }
    throw new Error('An error occurred.')
  }

  const { body: artistBody, statusCode: artistStatusCode } =
    await getArtistById({
      artistId:
        albumBody.artists[0].id ??
        albumBody.artists.find((artist) => artist.id)?.id,
      spotifyApi
    })

  const AlbumName = dynamic(() => import('@/components/AlbumName'), {
    ssr: false,
    loading: () => (
      <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
    )
  })

  const albumsCount =
    albumBody.total_tracks ??
    albumBody.tracks.total ??
    albumBody.tracks.items.length

  const artitstImageUrl =
    artistStatusCode !== 200 || !artistBody
      ? '/404-img.png'
      : artistBody.images[0].url ??
        artistBody.images.find((image) => image.url)?.url

  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center rounded-t-lg md:pt-8 gap-4 md:px-6 px-4'>
      <Image
        src={
          albumBody.images[0].url ??
          albumBody.images.find((image) => image.url)?.url ??
          '/404-img.png'
        }
        width={192}
        height={192}
        alt={`Album #${albumBody.id} cover image.`}
        className='rounded-md aspect-square shadow-2xl'
        priority
      />
      <div className='flex gap-6 flex-col justify-end self-start md:self-center'>
        <div className='flex flex-col gap-2'>
          <p className='text-white text-base hidden md:inline'>Album</p>
          <AlbumName albumName={albumBody.name} />
        </div>
        <div className='text-base flex gap-1 md:flex-row flex-col md:items-center items-start'>
          <div className='flex items-center gap-1'>
            <Image
              src={artitstImageUrl}
              alt={`Profile picture of ${
                artistBody ? `artist #${artistBody.id}` : 'album owner'
              }`}
              className='rounded-full'
              width={32}
              height={32}
            />
            {artistBody ? (
              <Link
                href={`/artist/${artistBody.id}`}
                className='text-white hover:underline cursor-pointer'
              >
                {artistBody.name}
              </Link>
            ) : (
              <strong className='text-white'>Unknown</strong>
            )}
          </div>
          <span className='before:content-["•"] hidden md:inline before:text-white before:mx-1 '>
            <span className='text-white'>
              {albumsCount > 1
                ? `${albumsCount} songs, `
                : `${albumsCount} song, `}
            </span>
            <span className='text-zinc-300'>
              about{' '}
              {formatPlaylistTotalDuration(
                albumBody.tracks.items.reduce((acc, currValue) => {
                  if (currValue) {
                    if (typeof currValue.duration_ms !== 'number') {
                      if (hasMillisecondProperty(currValue.duration_ms)) {
                        return (acc += (
                          currValue.duration_ms as {
                            totalMilliseconds: number
                          }
                        ).totalMilliseconds)
                      } else return acc
                    }
                    return (acc += currValue.duration_ms)
                  }
                  return acc
                }, 0)
              )}
            </span>
          </span>
          <span className='text-zinc-300 inline md:hidden'>
            {formatPlaylistTotalDuration(
              albumBody.tracks.items.reduce((acc, currValue) => {
                if (currValue) {
                  if (typeof currValue.duration_ms !== 'number') {
                    if (hasMillisecondProperty(currValue.duration_ms)) {
                      return (acc += (
                        currValue.duration_ms as {
                          totalMilliseconds: number
                        }
                      ).totalMilliseconds)
                    } else return acc
                  }
                  return (acc += currValue.duration_ms)
                }
                return acc
              }, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
