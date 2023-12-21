import {
  PlaylistHeaderSkeleton,
  PlaylistTableSkeleton
} from '@/components/ui/Skeletons'

export default function Loading() {
  return (
    <div className='flex flex-col gap-6 pt-16 min-h-full flex-1 rounded-t-lg'>
      <PlaylistHeaderSkeleton />
      <div className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
        <PlaylistTableSkeleton />
      </div>
    </div>
  )
}
