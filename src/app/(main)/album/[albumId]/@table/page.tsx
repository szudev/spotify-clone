import AlbumTableItem from '@/components/AlbumTableItem'
import { DurationIcon } from '@/components/Icons'
// import { AlbumTableItemSkeleton } from '@/components/ui/Skeletons'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { getAlbumById } from '@/services/album'
import { AlbumTrackMergeType } from '@/types/spotify-web-api-node'
// import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    albumId: string
  }
}

export default async function AlbumTable({ params }: Props) {
  const { albumId } = params
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { body, statusCode } = await getAlbumById({ albumId, spotifyApi })
  if (!body || statusCode !== 200) return notFound()

  const filteredTracks: AlbumTrackMergeType[] = body.tracks.items
    .filter((track) => track !== null && track.id && track && track.uri)
    .map((track) => {
      return {
        ...track,
        album: body,
        external_ids: body.external_ids,
        popularity: body.popularity
      }
    })

  const uris = filteredTracks.map((track) => track.uri)

  /* const AlbumTableItem = dynamic(() => import('@/components/AlbumTableItem'), {
    ssr: false,
    loading: () => <AlbumTableItemSkeleton />
  }) */

  return (
    <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
      <section className='flex flex-col pb-4 md:px-6 px-4 flex-1 md:pt-6 pt-0'>
        <div className='grid md:grid-cols-[minmax(30px,auto)_1fr_auto] grid-cols-1 gap-x-4 w-full'>
          <div className='grid-cols-[minmax(30px,auto)_1fr_auto] px-6 gap-x-4 hidden md:grid col-span-3 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
            <div className='flex items-center justify-center text-zinc-400'>
              #
            </div>
            <div className='flex items-center justify-start text-zinc-400'>
              Title
            </div>
            <div className='flex items-center justify-center text-zinc-400'>
              <DurationIcon className='h-4 w-4' />
            </div>
          </div>
          {filteredTracks.map((track, i) => {
            if (!track) return null
            return (
              <AlbumTableItem
                key={track.id ? track.id : `${i + 1}-${track.name}`}
                token={spotifyApi.getAccessToken()}
                i={i}
                track={track}
                uris={uris}
                tracks={filteredTracks}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
