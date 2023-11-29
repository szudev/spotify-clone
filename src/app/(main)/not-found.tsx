import Link from 'next/link'

export default async function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] px-6 pb-4 pt-16 min-h-full'>
      <h2 className='text-white font-bold text-xl'>Not Found</h2>
      <p className='text-zinc-400 font-medium text-lg'>
        Could not find requested resource
      </p>
      <Link
        href='/'
        className='text-white bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
      >
        Return Home
      </Link>
    </div>
  )
}
