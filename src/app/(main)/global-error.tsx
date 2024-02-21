'use client'

import { Button } from '@/components/Button'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className='flex items-center justify-center flex-col h-[100svh] p-0 md:p-2 gap-4 md:bg-black bg-zinc-900'>
        <p className='text-zinc-400 font-medium text-lg'>
          Something went wrong
        </p>
        <Button
          className='text-white text-lg bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
          onClick={() => location.reload()}
        >
          Reload now
        </Button>
      </body>
    </html>
  )
}
