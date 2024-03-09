import PlaylistHeader from '@/components/PlaylistHeader'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import PlaylistTable from '@/components/PlaylistTable'
import { getPlaylistById } from '@/services/playlists'
import { notFound } from 'next/navigation'
import { ApiStatusCodes, apiStatusDescriptions } from '@/lib/errors'

interface Props {
  params: {
    playlistId: string
  }
}

export async function generateMetadata({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { body, statusCode } = await getPlaylistById({ playlistId, spotifyApi })

  if (statusCode === 404) {
    notFound()
  }

  return {
    title:
      body && statusCode === 200
        ? `${body.name} | Spotify ${body.type}`
        : `${
            apiStatusDescriptions[statusCode as ApiStatusCodes]
              ? apiStatusDescriptions[statusCode as ApiStatusCodes]
              : 'Error'
          } | Spotify`
  }
}

export default async function Playlist({ params }: Props) {
  const { playlistId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  return (
    <section className='flex flex-col gap-6 pt-16 flex-1 rounded-t-lg'>
      <PlaylistHeader playlistId={playlistId} spotifyApi={spotifyApi} />
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
        <PlaylistTable playlistId={playlistId} spotifyApi={spotifyApi} />
      </div>
    </section>
  )
}
