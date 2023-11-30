export default function SessionMenuLoader() {
  return (
    <div className='w-full h-full to-zinc-900 bg-gradient-to-b from-[#222222] rounded-lg' />
  )
}

export function AsideUserPlaylistSkeleton() {
  return (
    <div className='flex flex-col gap-2 flex-1 overflow-y-auto p-2'>
      <PlaylistSkeleton />
      <PlaylistSkeleton />
      <PlaylistSkeleton />
      <PlaylistSkeleton />
    </div>
  )
}

function PlaylistSkeleton() {
  return (
    <div className='flex gap-2 py-2 px-1 rounded-md'>
      <div className='h-14 w-14 rounded-md bg-zinc-500 animate-pulse' />
      <div className='flex flex-col gap-2 flex-1 justify-center'>
        <div className='h-4 w-1/2 rounded-full bg-zinc-500 animate-pulse' />
        <div className='h-3 w-full rounded-full bg-zinc-500 animate-pulse' />
      </div>
    </div>
  )
}

export function RecentlyPlayedSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='h-6 w-[20%] rounded-full bg-zinc-500 animate-pulse' />
        <div className='h-4 w-1/12 rounded-full bg-zinc-500 animate-pulse' />
      </div>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4'>
        <RecentlyPlayedItemSkeleton />
        <RecentlyPlayedItemSkeleton />
        <RecentlyPlayedItemSkeleton />
        <RecentlyPlayedItemSkeleton />
      </div>
    </div>
  )
}

export function RecentlyPlayedFullListSkeleton() {
  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4'>
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
      <RecentlyPlayedItemSkeleton />
    </div>
  )
}

function RecentlyPlayedItemSkeleton() {
  return (
    <div className='flex flex-col p-2 gap-4'>
      <div className='w-full h-52 rounded-md bg-zinc-500 animate-pulse' />
      <div className='flex flex-col gap-2'>
        <div className='h-4 w-3/4 rounded-full bg-zinc-500 animate-pulse' />
        <div className='h-4 w-1/2 rounded-full bg-zinc-500 animate-pulse' />
      </div>
    </div>
  )
}

export function PlaylistHeaderSkeleton() {
  return (
    <div className='flex pt-8 gap-4 w-full px-6'>
      <div className='bg-zinc-500 animate-pulse rounded-md w-full md:w-[26%] h-48' />
      <div className='gap-2 flex-col flex justify-end w-full'>
        <div className='flex flex-col gap-3'>
          <div className='bg-zinc-500 animate-pulse rounded-full h-5 w-14' />
          <div className='bg-zinc-500 animate-pulse rounded-full h-[60px] w-3/5' />
          <div className='flex flex-col gap-2'>
            <div className='bg-zinc-500 animate-pulse rounded-full h-3 w-full' />
            <div className='bg-zinc-500 animate-pulse rounded-full h-3 w-1/2' />
          </div>
        </div>
        <div className='flex gap-1 items-center w-full'>
          <div className='h-8 w-8 rounded-full animate-pulse bg-zinc-500' />
          <div className='rounded-full animate-pulse bg-zinc-500 h-3 w-16' />
          <div className='before:content-["•"] flex items-center before:text-zinc-500 before:mr-1 before:animate-pulse'>
            <div className='bg-zinc-500 animate-pulse h-3 w-32 rounded-full' />
          </div>
        </div>
      </div>
    </div>
  )
}
