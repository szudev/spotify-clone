import { getUserSavedAlbums } from '@/services/album'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import Image from 'next/image'
import ClientCoverPlayer from './ClientCoverPlayer'
import ClientCurrentOnPlayCoverName from './ClientCurrentOnPlayCoverName'

interface Props {
  spotifyApi: SpotifyWebApi
}

export default async function AlbumsList({ spotifyApi }: Props) {
  const { body, statusCode } = await getUserSavedAlbums({
    spotifyApi,
    limit: 8
  })

  if (statusCode === 401) return redirect('/login')
  //NO CONTENT MANAGMENT
  if (!body || !body.items) return null

  return (
    <div className='grid xl:grid-cols-[repeat(4,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-cols-1 md:gap-4 gap-2'>
      {body.items.map((album) => {
        const tracks: (SpotifyApi.TrackObjectFull | null)[] =
          album.album.tracks.items
            .map((item) => ({
              ...item,
              album: album.album,
              external_ids: album.album.external_ids,
              popularity: album.album.popularity
            }))
            .filter((item) => item.id !== null && item.uri)
        const uris = tracks.map((track) => track!.uri)
        return (
          <Link
            className='md:bg-hover-effect grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 group md:gap-4 gap-2 bg-transparent md:bg-[#171717] rounded-md'
            key={album.album.id}
            href={`/album/${album.album.id}`}
          >
            <div className='relative rounded-md'>
              <Image
                src={album.album.images[0].url}
                width={album.album.images[0].width ?? 56}
                height={album.album.images[0].height ?? 56}
                className='rounded-md aspect-square w-full h-auto'
                alt={album.album.name}
                priority
                sizes='(min-width: 980px) calc(25vw - 124px), (min-width: 820px) calc(33.57vw - 152px), (min-width: 780px) calc(50vw - 201px), (min-width: 720px) calc(25vw - 60px), (min-width: 560px) calc(32.86vw - 61px), (min-width: 380px) calc(50vw - 72px), calc(100vw - 96px)'
              />
              <ClientCoverPlayer
                playerType='album'
                albumId={album.album.id}
                tracks={tracks}
                uris={uris}
                buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'
                iconStyles='h-1/2 w-1/2'
                onPlayStyle='opacity-100 -translate-y-2'
              />
            </div>
            <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
              <ClientCurrentOnPlayCoverName
                name={album.album.name}
                onPlay={{ playerType: 'album', albumId: album.album.id }}
              />
              <p className='text-zinc-400 text-sm truncate'>
                {album.album.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
