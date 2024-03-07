'use client'

import { ApiStatusCodes } from '@/lib/errors'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { formatTimeRemaining } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

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
  const [isReloading, setIsReloading] = useTransition()
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

  const handleReloadClick = () => {
    setIsReloading(() => {
      router.refresh()
    })
  }

  return (
    <div className='flex flex-col items-center justify-center gap-6 bg-zinc-900 px-6 pb-4 pt-16 flex-1'>
      <h2 className='text-white font-bold text-xl text-center'>
        Error {statusCode}
      </h2>
      <p className='text-zinc-400 font-medium text-lg text-center'>
        Too many requests
      </p>
      {countdown === 0 ? (
        !isReloading ? (
          <Button
            className='text-white text-lg bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
            onClick={handleReloadClick}
          >
            Reload now
          </Button>
        ) : (
          <div className='flex items-center justify-center px-4 py-2'>
            <Loader2 className='text-zinc-400 font-bold h-7 w-7 animate-spin' />
          </div>
        )
      ) : (
        <p className='text-white text-lg text-center'>
          {formatTimeRemaining(countdown)}
        </p>
      )}
    </div>
  )
}
