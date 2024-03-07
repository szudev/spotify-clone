import SearchAlbumPaginationStream from '@/components/SearchAlbumPaginationStream'
import { SearchGenrePaginationSkeleton } from '@/components/ui/Skeletons'
import { getAuthSession } from '@/lib/auth'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'

interface Props {
  params: {
    queryParam: string
  }
}

export default async function Page({ params }: Props) {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }
  const { queryParam } = params

  return (
    <section className='flex bg-zinc-900 flex-col md:px-6 px-4 flex-1 gap-4 md:pt-16 pt-4 pb-4'>
      <Suspense
        fallback={<SearchGenrePaginationSkeleton withCoverPlayer={false} />}
      >
        <SearchAlbumPaginationStream
          queryParam={queryParam}
          session={session}
          spotifyApi={spotifyApi}
        />
      </Suspense>
    </section>
  )
}
