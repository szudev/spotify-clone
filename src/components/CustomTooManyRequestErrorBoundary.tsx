'use client'

import { ApiStatusCodes } from '@/lib/errors'
import { useEffect, useRef, useState } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { formatTimeRemaining } from '@/lib/utils'

interface Props {
  statusCode: ApiStatusCodes
  retryAfter?: number
}

export default function CustomTooManyRequestErrorBoundary({
  statusCode,
  retryAfter
}: Props) {
  const [countdown, setCountdown] = useState<number>(retryAfter ?? 0)
  const startTimeRef = useRef<number>(Date.now())
  const router = useRouter()

  useEffect(() => {
    if (!retryAfter || countdown === 0) return
    startTimeRef.current = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = retryAfter - elapsed / 1000
      if (remaining <= 0) {
        clearInterval(timer)
        setCountdown(0)
      } else {
        setCountdown(remaining)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [retryAfter ? retryAfter : null])

  return (
    <div className='flex flex-col items-center justify-center gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] px-6 pb-4 pt-16 min-h-full'>
      <h2 className='text-white font-bold text-xl'>Error {statusCode}</h2>
      <p className='text-zinc-400 font-medium text-lg'>Too many requests</p>
      {countdown === 0 ? (
        <Button
          className='text-white text-lg bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
          onClick={() => router.refresh()}
        >
          Reload now
        </Button>
      ) : (
        <p className='text-white text-lg'>{formatTimeRemaining(countdown)}</p>
      )}
    </div>
  )
}
