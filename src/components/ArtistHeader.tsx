import { getArtistById } from '@/services/artist'
import { notFound } from 'next/navigation'
import SpotifyWebApi from 'spotify-web-api-node'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { formatArtistFollowersCount } from '@/lib/utils'

interface Props {
  spotifyApi: SpotifyWebApi
  artistId: string
}

export default async function ArtistHeader({ artistId, spotifyApi }: Props) {
  const { body, statusCode } = await getArtistById({ artistId, spotifyApi })
  if (!body || statusCode !== 200) return notFound()

  const artistImageSrc =
    body.images.find((image) => image.url)?.url ?? '/404-img.png'

  const ArtistName = dynamic(() => import('./ArtistName'), {
    ssr: false,
    loading: () => (
      <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
    )
  })

  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center md:pt-8 gap-4 md:px-6 px-4'>
      <Image
        src={artistImageSrc}
        width={192}
        height={192}
        alt={`Artist #${body.id} cover image.`}
        className='rounded-full aspect-square shadow-2xl'
        priority
      />
      <div className='flex flex-col justify-end self-start md:self-center gap-2 w-full'>
        <div className='flex flex-col gap-2'>
          <p className='text-white text-base hidden md:inline'>Artist</p>
          <ArtistName artistName={body.name} />
          <span className='text-zinc-300'>
            {formatArtistFollowersCount(body.followers.total)}{' '}
            {body.followers.total === 1 ? 'follower' : 'followers'}
          </span>
        </div>
      </div>
    </div>
  )
}
