import { getAuthSession } from '@/lib/auth'
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
  const { body, statusCode } = await getAlbumById({ albumId, spotifyApi })
  if (!body || statusCode !== 200) return notFound()

  return {
    title: `${body.name} | Spotify ${body.type ?? 'album'}`
  }
}

export default async function AlbumLayout({ table, title }: Props) {
  return (
    <section className='flex flex-col gap-6 pt-16 flex-1 rounded-t-lg'>
      {title}
      {table}
    </section>
  )
}
