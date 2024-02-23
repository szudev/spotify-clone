'use client'

import { Button } from '@/components/Button'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='flex flex-col items-center justify-center gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] px-6 pb-4 pt-16 min-h-full'>
      <h2 className='text-white font-bold text-xl'>Something went wrong</h2>
      <Button
        className='text-white text-lg bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
        onClick={() => reset()}
      >
        Reload now
      </Button>
    </div>
  )
}
