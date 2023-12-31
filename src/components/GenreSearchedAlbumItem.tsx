import SpotifyWebApi from 'spotify-web-api-node'
import Link from 'next/link'
import Image from 'next/image'
import ClientCoverPlayer from './ClientCoverPlayer'
import { getAlbumById } from '@/services/album'
import { AlbumTrackMergeType } from '@/types/spotify-web-api-node'

interface Props {
  albumItem: SpotifyApi.AlbumObjectSimplified
  spotifyApi: SpotifyWebApi
}

export default async function GenreSearchedAlbumItem({
  albumItem,
  spotifyApi
}: Props) {
  const { body, statusCode } = await getAlbumById({
    albumId: albumItem.id,
    spotifyApi
  })

  if (!body || statusCode !== 200) return null

  const tracks: AlbumTrackMergeType[] = body.tracks.items.map((item) => {
    return {
      ...item,
      album: albumItem,
      external_ids: body.external_ids,
      popularity: body.popularity
    }
  })
  const uris = body.tracks.items
    .filter((item) => item !== null)
    .map((item) => item!.uri)

  return (
    <Link
      key={albumItem.id}
      href={`/album/${albumItem.id}`}
      className='md:bg-hover-effect grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 group md:gap-4 gap-2 bg-transparent md:bg-black/30 rounded-md'
    >
      <div className='relative rounded-md'>
        <Image
          src={
            albumItem.images.find((image) => image.url)?.url ?? '404-img.png'
          }
          width={56}
          height={56}
          className='rounded-md aspect-square w-full h-auto'
          alt={albumItem.name}
          priority
          sizes='(min-width: 1120px) calc(20vw - 106px), (min-width: 960px) calc(25vw - 121px), (min-width: 800px) calc(33.57vw - 150px), calc(25.83vw - 11px)'
        />
        <ClientCoverPlayer
          playerType='album'
          tracks={tracks}
          albumId={albumItem.id}
          uris={uris}
          buttonStyles='absolute z-10 bottom-0 hover:scale-105 hover:duration-100 group-hover:opacity-100 ease-in duration-200 group-hover:-translate-y-2 opacity-0 transition-all hidden md:flex items-center justify-center right-0 mx-2 rounded-full w-[30%] h-[30%] bg-green-500'
          iconStyles='h-1/2 w-1/2'
        />
      </div>
      <div className='flex flex-col gap-0 md:gap-1 justify-center overflow-hidden md:justify-start'>
        <strong className='text-white text-base block truncate'>
          {albumItem.name}
        </strong>
        <p className='text-zinc-400 text-sm truncate'>
          {albumItem.artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
    </Link>
  )
}
