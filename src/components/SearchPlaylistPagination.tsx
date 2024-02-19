'use client'

import { Button } from './Button'
import Link from 'next/link'
import Image from 'next/image'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { SearchPlaylists, SearchPlaylistsReturnType } from '@/services/search'
import { Session } from 'next-auth'
import { SearchGenrePaginationLoadMoreSkeleton } from './ui/Skeletons'
import { notFound } from 'next/navigation'
import ClientCoverPlayer from './ClientCoverPlayer'
import ClientCurrentOnPlayCoverName from './ClientCurrentOnPlayCoverName'

interface Props {
  queryParam: string
  body: SearchPlaylistsReturnType
  session: Session | null
}

export default function SearchPlaylistPagination({
  queryParam,
  body,
  session
}: Props) {
  const initialData: InfiniteData<SearchPlaylistsReturnType> = {
    pages: [body],
    pageParams: [0]
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-playlist', queryParam],
      async ({ pageParam }) =>
        await SearchPlaylists({
          queryParam,
          session,
          limit: 5,
          offset: pageParam
        }),
      {
        getNextPageParam: (lastPage) => {
          if (lastPage && lastPage.body && lastPage.body.next) {
            const urlSearchParams = new URLSearchParams(
              new URL(lastPage.body.next).search
            )
            const offsetValue = urlSearchParams.get('offset')
            return Number(offsetValue)
          }
        },
        initialData: initialData,
        enabled: false,
        refetchOnWindowFocus: false
      }
    )

  const playlists =
    data?.pages.flatMap((page) => page.body?.items) ?? body.body?.items

  if (!playlists) return notFound()

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='grid md:grid-cols-5 grid-cols-2 gap-4 md:gap-2'>
        {playlists.map((playlist) => {
          if (!playlist) return null
          const imageSrc =
            playlist.images.find((image) => image.url)?.url ?? '/404-img.png'
          const tracks = playlist.tracks.map((track) => track)
          const uris = tracks
            .filter((track) => track !== null)
            .map((track) => track!.uri)
          return (
            <Link
              className='grid grid-cols-1 grid-rows-[1fr_auto] rounded-md md:p-4 p-0 md:bg-black/30 bg-transparent md:bg-hover-effect md:gap-5 gap-2 group'
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
            >
              <div className='relative rounded-md'>
                <Image
                  src={imageSrc}
                  width={56}
                  height={56}
                  className='rounded-md aspect-square w-full h-auto'
                  alt={playlist.name}
                  priority
                  sizes='(min-width: 980px) calc(25vw - 124px), (min-width: 820px) calc(33.57vw - 152px), (min-width: 780px) calc(50vw - 201px), (min-width: 720px) calc(25vw - 60px), (min-width: 560px) calc(32.86vw - 61px), (min-width: 380px) calc(50vw - 72px), calc(100vw - 96px)'
                />
                <ClientCoverPlayer
                  playerType='playlist'
                  playlistId={playlist.id}
                  tracks={tracks}
                  uris={uris}
                  iconStyles='h-1/2 w-1/2'
                  onPlayStyle='opacity-100 -translate-y-2'
                  buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'
                />
              </div>
              <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
                <ClientCurrentOnPlayCoverName
                  name={playlist.name}
                  onPlay={{ playerType: 'playlist', playlistId: playlist.id }}
                />
                <p className='text-zinc-400 text-sm truncate'>
                  {playlist.owner.display_name ?? 'Unknown'}
                </p>
              </div>
            </Link>
          )
        })}
        {isFetchingNextPage ? (
          <SearchGenrePaginationLoadMoreSkeleton withCoverPlayer={false} />
        ) : null}
      </div>
      {hasNextPage && !isFetchingNextPage ? (
        <Button
          onClick={() => fetchNextPage()}
          className='text-zinc-400 self-center hover:text-white focus-text-white bg-black/30 rounded-md py-2 px-4 hover:[outline:1px_solid_rgba(255,255,255,.15)] focus-within:outline-white focus-within:outline focus-within:hover:outline-white focus-within:outline-2 focus-within:hover:outline focus-within:hover:outline-2'
        >
          Show more
        </Button>
      ) : null}
    </div>
  )
}
