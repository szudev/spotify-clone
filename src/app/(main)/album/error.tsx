'use client'

import { Button } from '@/components/Button'
import { CustomErrorMessageObject, apiStatusDescriptions } from '@/lib/errors'
import { formatTimeRemaining } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  /* const messageObject: CustomErrorMessageObject = JSON.parse(error.message)
  const statusDescription: string =
    apiStatusDescriptions[messageObject.statusCode]
  const [countdown, setCountdown] = useState<number>(
    messageObject.retryAfter ? messageObject.retryAfter : 0
  )
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!messageObject.retryAfter) return
    startTimeRef.current = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = messageObject.retryAfter! - elapsed / 1000
      if (remaining <= 0) {
        clearInterval(timer)
        setCountdown(0)
      } else {
        setCountdown(remaining)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [messageObject.retryAfter ? messageObject.retryAfter : null]) */

  return (
    <div className='flex flex-col items-center justify-center gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] px-6 pb-4 pt-16 min-h-full'>
      <h2 className='text-white font-bold text-xl'>Error 429</h2>
      <p className='text-zinc-400 font-medium text-lg'>Too many Requests</p>
      <Button
        className='text-white text-lg bg-hover-effect px-4 py-2 rounded-md border border-zinc-400'
        onClick={() => reset()}
      >
        Reload now
      </Button>
    </div>
  )
}
