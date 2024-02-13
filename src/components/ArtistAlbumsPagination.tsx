'use client'

import {
  ArtistAlbumsReturnType,
  getArtistAlbumsPaginated
} from '@/services/artist'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import ClientCoverPlayer from './ClientCoverPlayer'
import ClientCurrentOnPlayCoverName from './ClientCurrentOnPlayCoverName'
import { formatAlbumReleaseDateToYear } from '@/lib/utils'
import { SearchGenrePaginationLoadMoreSkeleton } from './ui/Skeletons'
import { Button } from './Button'

interface Props {
  artistId: string
  body: ArtistAlbumsReturnType
  session: Session | null
}

export default function ArtistAlbumsPagination({
  artistId,
  body,
  session
}: Props) {
  const initialData: InfiniteData<ArtistAlbumsReturnType> = {
    pages: [body],
    pageParams: [0]
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['infinite-artist-album', artistId],
      async ({ pageParam }) =>
        await getArtistAlbumsPaginated({
          artistId,
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

  const albums =
    data?.pages.flatMap((page) => page.body?.items) ?? body.body?.items

  if (!albums) return notFound()

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <h1 className='text-white text-2xl font-bold'>Artist Albums</h1>
      <div className='grid md:grid-cols-5 grid-cols-2 gap-4 md:gap-2'>
        {albums.map((album) => {
          if (!album) return null
          const imageSrc =
            album.images.find((image) => image.url)?.url ?? '/404-img.png'
          const tracks = album.tracks.map((track) => track)
          const uris = tracks
            .filter((track) => track !== null)
            .map((track) => track!.uri)

          return (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className='grid grid-cols-1 grid-rows-[1fr_auto] rounded-md md:p-4 p-0 md:bg-black/30 bg-transparent md:bg-hover-effect md:gap-5 gap-2 group'
            >
              <div className='relative rounded-md'>
                <Image
                  src={imageSrc}
                  alt={`Album ${album.name} cover image`}
                  height={172}
                  width={172}
                  className='aspect-square rounded-md w-full h-auto'
                />
                <Suspense
                  fallback={
                    <div className='absolute z-10 bottom-0 -translate-y-1 opacity-100 transition-all hidden md:flex items-center justify-center right-0 mx-1 rounded-full w-12 h-12 bg-zinc-700 animate-pulse' />
                  }
                >
                  <ClientCoverPlayer
                    playerType='album'
                    albumId={album.id}
                    tracks={tracks}
                    uris={uris}
                    iconStyles='h-1/2 w-1/2'
                    onPlayStyle='opacity-100 -translate-y-2'
                    buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'
                  />
                </Suspense>
              </div>
              <div className='flex flex-col items-start overflow-x-hidden'>
                <ClientCurrentOnPlayCoverName
                  name={album.name}
                  onPlay={{ playerType: 'album', albumId: album.id }}
                />
                <p className='text-zinc-400 text-sm capitalize truncate rounded-full w-full'>
                  {album.artists.map((artist) => artist.name).join(', ') ??
                    'unkown'}
                </p>
                <p className='text-zinc-400 md:hidden inline text-sm capitalize truncate rounded-full'>
                  {formatAlbumReleaseDateToYear(album.release_date) ?? null}
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
