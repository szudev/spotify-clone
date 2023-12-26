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

export function MainHeaderSkeleton() {
  return (
    <div className='z-[998] hidden md:flex gap-2 w-full h-16 absolute top-0 justify-between items-center px-6'>
      <div className='flex items-center justify-center gap-2'>
        <div className='rounded-full h-8 w-8 p-2 bg-zinc-500 animate-pulse' />
        <div className='rounded-full h-8 w-8 p-2 bg-zinc-500 animate-pulse' />
      </div>
      <div className='rounded-full h-10 w-10 animate-pulse bg-zinc-500' />
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
    <div className='flex flex-col gap-6'>
      <div className='flex items-center'>
        <div className='h-6 w-[20%] rounded-full bg-zinc-500 animate-pulse' />
      </div>
      <div className='flex items-center justify-between'>
        <div className='h-6 w-[20%] rounded-full bg-zinc-500 animate-pulse' />
        <div className='h-4 w-1/12 rounded-full bg-zinc-500 animate-pulse' />
      </div>
      <div className='grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2'>
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
    <div className='md:flex md:flex-col grid grid-cols-[40%_1fr] gap-2 md:gap-4 p-0 md:p-4'>
      <div className='relative rounded-md'>
        <div className='rounded-l-md md:rounded-md w-full h-auto aspect-square bg-zinc-500 animate-pulse' />
      </div>
      <div className='flex flex-row md:flex-col gap-0 md:gap-2 md:items-start items-center pr-2 py-2 md:pr-0 md:py-0 justify-start'>
        <div className='h-4 w-3/4 rounded-full bg-zinc-500 animate-pulse' />
        <div className='h-4 w-1/2 rounded-full md:inline hidden bg-zinc-500 animate-pulse' />
      </div>
    </div>
  )
}

export function PlaylistHeaderSkeleton() {
  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center md:pt-8 gap-4 md:px-6 px-4'>
      <div className='bg-zinc-500 animate-pulse rounded-md aspect-square w-48 h-48' />
      <div className='flex flex-col justify-end self-start md:self-center gap-2 w-full'>
        <div className='flex flex-col gap-3'>
          <div className='bg-zinc-500 animate-pulse rounded-full hidden md:inline h-5 w-14' />
          <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
          <div className='flex flex-col gap-2'>
            <div className='bg-zinc-500 animate-pulse rounded-full h-3 w-[90%] md:w-1/2' />
            <div className='bg-zinc-500 animate-pulse rounded-full h-3 w-1/2 md:w-1/2' />
          </div>
        </div>
        <div className='flex gap-1 items-center w-full'>
          <div className='gap-1 items-center flex'>
            <div className='h-8 w-8 rounded-full animate-pulse bg-zinc-500' />
            <div className='rounded-full animate-pulse bg-zinc-500 h-3 w-16' />
            <div className='before:content-["•"] hidden md:flex items-center before:text-zinc-500 before:mr-1 before:animate-pulse'>
              <div className='bg-zinc-500 animate-pulse h-3 w-32 rounded-full' />
            </div>
          </div>
        </div>
        <div className='bg-zinc-500 inline md:hidden animate-pulse rounded-full h-3 w-24' />
      </div>
    </div>
  )
}

export function AlbumHeaderSkeleton() {
  return (
    <div className='flex lg:flex-row flex-col pt-0 items-center md:pt-8 gap-4 md:px-6 px-4'>
      <div className='bg-zinc-500 animate-pulse rounded-md aspect-square w-48 h-48' />
      <div className='flex flex-col justify-end self-start md:self-center gap-6 w-full'>
        <div className='flex flex-col gap-3'>
          <div className='bg-zinc-500 animate-pulse rounded-full hidden md:inline h-5 w-14' />
          <div className='bg-zinc-500 animate-pulse rounded-full h-6 md:h-[60px] w-3/5' />
        </div>
        <div className='flex gap-1 items-center w-full'>
          <div className='gap-1 items-center flex'>
            <div className='h-8 w-8 rounded-full animate-pulse bg-zinc-500' />
            <div className='rounded-full animate-pulse bg-zinc-500 h-3 w-16' />
            <div className='before:content-["•"] hidden md:flex items-center before:text-zinc-500 before:mr-1 before:animate-pulse'>
              <div className='bg-zinc-500 animate-pulse h-3 w-32 rounded-full' />
            </div>
          </div>
        </div>
        <div className='bg-zinc-500 inline md:hidden animate-pulse rounded-full h-3 w-24' />
      </div>
    </div>
  )
}

export function PlaylistTableSkeleton() {
  return (
    <section className='flex flex-col pb-4 md:px-6 px-4 flex-1 md:pt-6 pt-0'>
      <div className='grid md:grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] grid-cols-1 gap-x-4 w-full'>
        <div className='grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] pl-6 gap-x-4 hidden md:grid col-span-5 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
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

export function GenreListSkeleton() {
  return (
    <section className='grid md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] [grid-auto-rows:80px] grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3'>
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
      <GenreListItem />
    </section>
  )
}

export function GenreListItem() {
  return (
    <div className='rounded-lg p-3 bg-zinc-500 animate-pulse items-center justify-center w-full h-auto' />
  )
}

export function AlbumTableSkeleton() {
  return (
    <section className='bg-gradient-to-b md:from-black/10 from-transparent md:to-zinc-900 to-zinc-900 to-[100px] md:to-[200px] w-full flex-1'>
      <div className='flex flex-col pb-4 md:px-6 px-4 flex-1 md:pt-6 pt-0'>
        <div className='grid md:grid-cols-[minmax(30px,auto)_1fr_auto] grid-cols-1 gap-x-4 w-full'>
          <div className='grid-cols-[minmax(30px,auto)_1fr_auto] px-6 gap-x-4 hidden md:grid col-span-3 mb-3 [border-bottom:1px_solid_rgba(255,255,255,.15)] pb-3 w-full'>
            <div className='flex items-center justify-center text-zinc-400'>
              <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
            </div>
            <div className='flex items-center justify-start'>
              <div className='h-4 w-[13%] rounded-full bg-zinc-500 animate-pulse ' />
            </div>
            <div className='flex items-center justify-center'>
              <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
            </div>
          </div>
          <AlbumTableItemSkeleton />
          <AlbumTableItemSkeleton />
          <AlbumTableItemSkeleton />
          <AlbumTableItemSkeleton />
          <AlbumTableItemSkeleton />
          <AlbumTableItemSkeleton />
        </div>
      </div>
    </section>
  )
}

export function PlaylistTableItemSkeleton() {
  return (
    <div className='text-zinc-400 gap-x-4 py-2 md:pl-5 pl-0 items-center grid grid-cols-[25%_1fr] md:grid-cols-[minmax(30px,auto)_1fr_1fr_1fr_1fr] md:col-span-5 w-full'>
      <div className='col-start-1 hidden md:inline text-center'>
        <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
      <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1 items-center'>
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

export function AlbumTableItemSkeleton() {
  return (
    <div className='text-zinc-400 gap-x-4 py-2 md:pl-5 pl-0 items-center grid grid-cols-[25%_1fr] md:grid-cols-[minmax(30px,auto)_1fr_auto] md:col-span-3 w-full'>
      <div className='col-start-1 hidden md:flex text-center pl-3'>
        <div className='h-4 w-4 rounded-full bg-zinc-500 animate-pulse ' />
      </div>
      <div className='flex md:gap-4 gap-2 md:col-start-2 col-start-1 col-span-2 md:col-span-1 items-center'>
        <div className='flex flex-col gap-2'>
          <div className='table table-fixed w-full'>
            <div className='h-4 md:w-[25%] w-full rounded-full bg-zinc-500 animate-pulse ' />
          </div>
          <div className='table table-fixed w-full'>
            <div className='h-4 md:w-[15%] w-1/2 rounded-full bg-zinc-500 animate-pulse ' />
          </div>
        </div>
      </div>
      <div className='col-start-5 flex justify-center pr-3'>
        <div className='h-4 md:w-8 w-0 rounded-full bg-zinc-500 animate-pulse' />
      </div>
    </div>
  )
}

export function AlbumListSkeleton() {
  return (
    <div className='grid xl:grid-cols-[repeat(4,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] grid-cols-1 md:gap-4 gap-2'>
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
      <AlbumListItemSkeleton />
    </div>
  )
}

function AlbumListItemSkeleton() {
  return (
    <div className='grid grid-cols-[25%_1fr] md:flex md:flex-col md:p-4 p-0 md:gap-4 gap-2 bg-transparent'>
      <div className='rounded-md aspect-square bg-zinc-400 animate-pulse w-full h-auto' />
      <div className='flex flex-col gap-1 md:gap-1 justify-center md:justify-start'>
        <div className='bg-zinc-400 animate-pulse rounded-full h-5 w-[75%]' />
        <div className='bg-zinc-400 animate-pulse rounded-full h-4 w-[55%]' />
      </div>
    </div>
  )
}

export function GenreSearchResultSkeleton() {
  return (
    <div className='flex flex-col flex-1 w-full'>
      <div className='flex justify-start items-end py-7 break-all w-full'>
        <div className='md:h-20 w-1/2 bg-zinc-500 animate-pulse rounded-full' />
      </div>
      <div className='pt-7 w-full flex flex-col gap-7 flex-1'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center w-full justify-between'>
            <div className='h-6 md:w-1/5 w-1/3 bg-zinc-500 animate-pulse rounded-full' />
            <div className='h-[0.875rem] md:w-[10%] w-1/5 bg-zinc-500 animate-pulse rounded-full' />
          </div>
          <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3'>
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center w-full justify-between'>
            <div className='h-6 md:w-1/5 w-1/3 bg-zinc-500 animate-pulse rounded-full' />
            <div className='h-[0.875rem] md:w-[10%] w-1/5 bg-zinc-500 animate-pulse rounded-full' />
          </div>
          <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3'>
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
            <AlbumListItemSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
