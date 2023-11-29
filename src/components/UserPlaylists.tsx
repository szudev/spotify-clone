'use client'

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query'
import AsideUserPlayList from './AsideUserPlayList'
import { getUserPlayLists } from '@/services/playlists'
import { Button } from './Button'
import { Session } from 'next-auth'
import { Loader2 } from 'lucide-react'

interface Props {
  body: SpotifyApi.ListOfUsersPlaylistsResponse
  session: Session | null
}

export default function UserPlaylists({ body, session }: Props) {
  const initialData: InfiniteData<SpotifyApi.ListOfUsersPlaylistsResponse> = {
    pages: [body],
    pageParams: [0]
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-playlist'],
      async ({ pageParam }) => await getUserPlayLists({ pageParam, session }),
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.next) {
            const urlSearchParams = new URLSearchParams(
              new URL(lastPage.next).search
            )
            const offsetValue = urlSearchParams.get('offset')
            return Number(offsetValue)
          }
          return undefined
        },
        initialData: initialData,
        enabled: false,
        refetchOnWindowFocus: false
      }
    )

  const playlists = data?.pages.flatMap((page) => page.items) ?? body.items

  return (
    <section className='flex flex-col gap-2 flex-1 overflow-y-auto p-2'>
      {playlists.map((playlist) => (
        <AsideUserPlayList key={playlist.id} playlist={playlist} />
      ))}
      {hasNextPage && !isFetchingNextPage ? (
        <Button
          className='text-zinc-400 hover:text-white hover:bg-hover-effect rounded-md py-2'
          onClick={() => fetchNextPage()}
        >
          Show more
        </Button>
      ) : null}
      {isFetchingNextPage ? (
        <div className='flex items-center justify-center'>
          <Loader2 className='text-white font-bold h-7 w-7 animate-spin' />
        </div>
      ) : null}
    </section>
  )
}
