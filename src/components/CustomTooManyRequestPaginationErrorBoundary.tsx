'use client'

import { ApiStatusCodes } from '@/lib/errors'
import { Loader2 } from 'lucide-react'
import { Button } from './Button'
import { useEffect, useRef, useState, useTransition } from 'react'
import { InfiniteQueryObserverResult } from '@tanstack/react-query'
import { formatTimeRemaining } from '@/lib/utils'

interface Props {
  statusCode: ApiStatusCodes
  retryAfter?: number
  action: () => Promise<InfiniteQueryObserverResult<any, unknown>>
}

export default function CustomTooManyRequestPaginationErrorBoundary({
  statusCode,
  retryAfter,
  action
}: Props) {
  const [countdown, setCountdown] = useState<number>(retryAfter ?? 0)
  const startTimeRef = useRef<number>(Date.now())
  const [isReloading, setIsReloading] = useTransition()

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

  const handleReloadClick = () => {
    setIsReloading(() => {
      action()
    })
  }

  return (
    <div className='flex flex-col self-center items-center gap-2 rounded-md p-2 outline-1 outline outline-red-600'>
      <h2 className='text-white font-bold text-center'>Error {statusCode}</h2>
      <p className='text-zinc-400 font-medium text-sm text-center'>
        Too many requests
      </p>
      {countdown === 0 ? (
        !isReloading ? (
          <Button
            className='text-zinc-400 self-center hover:text-white focus-text-white bg-black/30 rounded-md py-2 px-4 hover:[outline:1px_solid_rgba(255,255,255,.15)] focus-within:outline-white focus-within:outline focus-within:hover:outline-white focus-within:outline-2 focus-within:hover:outline focus-within:hover:outline-2'
            onClick={handleReloadClick}
          >
            Try again
          </Button>
        ) : (
          <div className='flex items-center justify-center px-4 py-2'>
            <Loader2 className='text-zinc-400 font-bold h-7 w-7 animate-spin' />
          </div>
        )
      ) : (
        <p className='text-white text-center'>
          {formatTimeRemaining(countdown)}
        </p>
      )}
    </div>
  )
}
