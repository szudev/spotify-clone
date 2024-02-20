'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Button } from './Button'
import { useRouter } from 'next/navigation'
import { formatTimeRemaining } from '@/lib/utils'
import { apiStatusDescriptions } from '@/lib/errors'
import { Loader2 } from 'lucide-react'

interface Props {
  retryAfter: number
}

export default function LayoutRetryAfterErrorBoundary({ retryAfter }: Props) {
  const [countdown, setCountdown] = useState<number>(retryAfter)
  const [isReloading, setIsReloading] = useTransition()
  const startTimeRef = useRef<number>(Date.now())
  const router = useRouter()
  const statusDescription: string = apiStatusDescriptions[429]

  useEffect(() => {
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
  }, [retryAfter])

  const handleReloadClick = () => {
    setIsReloading(() => {
      router.refresh()
    })
  }

  return countdown === 0 && isReloading === false ? (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <p className='text-white text-lg'>Error 429</p>
      <p className='text-zinc-400 text-sm'>{statusDescription}</p>
      <Button
        className='text-zinc-400 border w-full border-zinc-400 hover:text-white hover:bg-hover-effect rounded-md py-2'
        onClick={handleReloadClick}
      >
        Reload
      </Button>
    </div>
  ) : isReloading === false ? (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <p className='text-white text-lg'>Error 429</p>
      <p className='text-zinc-400 text-sm'>{statusDescription}</p>
      <p className='text-zinc-400 text-lg'>{formatTimeRemaining(countdown)}</p>
    </div>
  ) : (
    <div className='flex items-center justify-center'>
      <Loader2 className='text-zinc-400 font-bold h-7 w-7 animate-spin' />
    </div>
  )
}
