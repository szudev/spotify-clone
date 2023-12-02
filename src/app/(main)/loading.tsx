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
      <div className='bg-zinc-500 animate-pulse rounded-md aspect-square w-48 h-48' />
      <div className='gap-2 flex-col flex justify-end w-full'>
        <div className='flex flex-col gap-3'>
          <div className='bg-zinc-500 animate-pulse rounded-full h-5 w-14' />
          <div className='bg-zinc-500 animate-pulse rounded-full h-[60px] w-3/5' />
          <div className='flex flex-col gap-2'>
            <div className='bg-zinc-500 animate-pulse rounded-full h-3 w-1/2' />
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

export function PlaylistTableSkeleton() {
  return (
    <section className='flex flex-col pb-4 px-6 flex-1 pt-6'>
      <div className='grid grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] gap-x-4 w-full'>
        <div className='grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] pl-6 gap-x-4 grid col-span-5 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
          <div className='flex items-center justify-center text-zinc-400'>
            <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='flex items-center justify-start'>
            <div className='h-4 w-1/4 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='flex items-center justify-start'>
            <div className='h-4 w-1/4 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='flex items-center justify-start text-zinc-400'>
            <div className='h-4 w-1/4 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='flex items-center justify-center'>
            <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
        </div>
        <PlaylistTableItemSkeleton />
        <PlaylistTableItemSkeleton />
        <PlaylistTableItemSkeleton />
        <PlaylistTableItemSkeleton />
        <PlaylistTableItemSkeleton />
        <PlaylistTableItemSkeleton />
      </div>
    </section>
  )
}

function PlaylistTableItemSkeleton() {
  return (
    <div className='text-zinc-400 gap-x-4 py-2 pl-5 items-center grid grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] col-span-5 w-full'>
      <div className='col-start-1 text-center'>
        <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
      <div className='flex gap-4 col-start-2'>
        <div className='bg-zinc-500 animate-pulse rounded-md aspect-square w-12 h-12' />
        <div className='flex flex-col gap-2'>
          <div className='table table-fixed w-full'>
            <div className='h-4 w-full rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='table table-fixed w-full'>
            <div className='h-4 w-1/2 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
        </div>
      </div>
      <div className='w-full col-start-3 overflow-hidden'>
        <div className='h-4 w-3/4 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
      <div className='col-start-4'>
        <div className='h-4 w-2/4 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
      <div className='col-start-5 flex justify-center'>
        <div className='h-4 w-2/5 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
    </div>
  )
}
