/* eslint-disable @next/next/no-img-element */
import ArtistHeader from '@/components/ArtistHeader'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { getArtistById } from '@/services/artist'
import { notFound } from 'next/navigation'
import PopularArtistSongs from '@/components/PopularArtistSongs'
import ArtistAlbums from '@/components/ArtistAlbums'

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
  const { body, statusCode } = await getArtistById({
    artistId,
    spotifyApi
  })
  if (!body || statusCode !== 200) {
    if (!body || statusCode === 404 || statusCode === 204) {
      notFound()
    }
    throw new Error('An error occurred.')
  }

  return {
    title: `${body.name} | Spotify`
  }
}

export default async function Page({ params }: Props) {
  const { artistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  return (
    <section className='flex flex-col gap-6 pt-16 flex-1 rounded-t-lg'>
      <ArtistHeader artistId={artistId} spotifyApi={spotifyApi} />
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1 flex flex-col'>
        <section className='flex flex-col justify-start h-full gap-4 md:py-7 pb-7 pt-0 md:px-6 px-4'>
          <h1 className='text-white text-2xl font-bold'>Popular</h1>
          <PopularArtistSongs artistId={artistId} spotifyApi={spotifyApi} />
        </section>
        <ArtistAlbums artistId={artistId} spotifyApi={spotifyApi} />
      </div>
    </section>
  )
}
