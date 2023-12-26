import Link from 'next/link'
import { genres } from '@/lib/constants'
import { ListofColors } from '@/lib/background-colors'
import { cn } from '@/lib/utils'
import { shuffle } from 'lodash'

export default function SearchRoot() {
  return (
    <>
      <div className='flex items-center justify-start'>
        <p className='text-white text-xl font-semibold'>Browse all</p>
      </div>
      <section className='grid md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] [grid-auto-rows:80px] grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3'>
        {genres.map((genre, i) => (
          <Link
            key={`#${i}-${genre}`}
            href={`?${new URLSearchParams({ q: genre })}`}
            className={cn(
              'rounded-lg p-3 flex items-center justify-center md:hover:opacity-100 md:focus:opacity-100 md:tracking-wider focus:outline-white md:opacity-60',
              shuffle(ListofColors).pop()
            )}
          >
            <strong className='text-white text-lg capitalize text-center'>
              {genre}
            </strong>
          </Link>
        ))}
      </section>
    </>
  )
}
