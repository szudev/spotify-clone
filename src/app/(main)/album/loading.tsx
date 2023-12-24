import {
  AlbumHeaderSkeleton,
  AlbumTableSkeleton
} from '@/components/ui/Skeletons'

export default function Loading() {
  return (
    <div className='flex flex-col gap-6 flex-1 pt-16 rounded-t-lg'>
      <AlbumHeaderSkeleton />
      <AlbumTableSkeleton />
    </div>
  )
}
