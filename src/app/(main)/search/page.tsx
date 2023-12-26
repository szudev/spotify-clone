import CustomSearchedResult from '@/components/CustomSearchedResult'
import GenreSearchedResult from '@/components/GenreSearchedResult'
import SearchRoot from '@/components/SearchRoot'
import { GenreSearchResultSkeleton } from '@/components/ui/Skeletons'
import { getAuthSession } from '@/lib/auth'
import { genres } from '@/lib/constants'
import spotifyApi from '@/lib/spotify'
import { Suspense } from 'react'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Props) {
  const session = await getAuthSession()
  if (session?.user && session.user.accessToken) {
    spotifyApi.setAccessToken(session.user.accessToken)
  }

  const queryParam = searchParams.q as string

  return (
    <section className='flex bg-zinc-900 flex-col md:px-6 px-4 flex-1 gap-4 md:pt-16 pt-4'>
      {queryParam ? (
        genres.includes(queryParam) ? (
          <Suspense fallback={<GenreSearchResultSkeleton />}>
            <GenreSearchedResult
              queryParam={queryParam}
              spotifyApi={spotifyApi}
            />
          </Suspense>
        ) : (
          <CustomSearchedResult
            queryParam={queryParam}
            spotifyApi={spotifyApi}
          />
        )
      ) : (
        <SearchRoot />
      )}
    </section>
  )
}
