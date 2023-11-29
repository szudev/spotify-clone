import Image from 'next/image'
import Link from 'next/link'

interface Props {
  playlist: SpotifyApi.PlaylistObjectSimplified
}

export default function AsideUserPlayList({ playlist }: Props) {
  return (
    <Link
      href={`/playlist/${playlist.id}`}
      className='flex gap-2 text-white bg-hover-effect py-2 px-1 rounded-md'
    >
      <Image
        src={playlist.images[0].url}
        alt={playlist.name}
        width={56}
        height={56}
        className='rounded-md'
      />
      <div className='flex flex-col gap-1 justify-center'>
        <p className='text-white block truncate font-normal max-w-[8rem] text-base'>
          {playlist.name}
        </p>
        <p className='text-sm text-zinc-400 truncate block max-w-[8rem]'>
          {playlist.owner.display_name}
        </p>
      </div>
    </Link>
  )
}
