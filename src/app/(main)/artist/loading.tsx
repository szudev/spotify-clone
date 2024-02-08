import {
  ArtitstHeaderSkeleton,
  PopularArtistSongsSectionSkeleton,
  ArtistAlbumsSectionSkeleton
} from '@/components/ui/Skeletons'

export default function Loading() {
  return (
    <div className='flex flex-col gap-6 pt-16 flex-1 rounded-t-lg'>
      <ArtitstHeaderSkeleton />
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
        <PopularArtistSongsSectionSkeleton />
        <ArtistAlbumsSectionSkeleton />
      </div>
    </div>
  )
}
