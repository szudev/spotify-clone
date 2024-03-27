'use client'

import { ApiStatusCodes, isCustomApiErrorObject } from '@/lib/errors'
import CustomTooManyRequestPaginationErrorBoundary from '@/components/CustomTooManyRequestPaginationErrorBoundary'
import { Button } from './Button'
import { InfiniteQueryObserverResult } from '@tanstack/react-query'

interface Props {
  error: unknown
  statusCode: ApiStatusCodes
  action: () => Promise<InfiniteQueryObserverResult<any, unknown>>
}

export default function PaginationErrorBoundary({
  error,
  statusCode,
  action
}: Props) {
  if (statusCode === 429) {
    if (isCustomApiErrorObject(error)) {
      const retryAfter = error.headers['retry-after']
        ? parseInt(error.headers['retry-after'], 10)
        : undefined
      return (
        <CustomTooManyRequestPaginationErrorBoundary
          statusCode={statusCode}
          retryAfter={retryAfter}
          action={action}
        />
      )
    } else {
      return (
        <CustomTooManyRequestPaginationErrorBoundary
          statusCode={statusCode}
          action={action}
        />
      )
    }
  }
  return (
    <div className='flex flex-col self-center items-center gap-2 rounded-md p-2 outline-1 outline outline-red-600'>
      <p className='text-white'>Error {statusCode}</p>
      <Button
        onClick={() => action()}
        className='text-zinc-400 self-center hover:text-white focus-text-white bg-black/30 rounded-md py-2 px-4 hover:[outline:1px_solid_rgba(255,255,255,.15)] focus-within:outline-white focus-within:outline focus-within:hover:outline-white focus-within:outline-2 focus-within:hover:outline focus-within:hover:outline-2'
      >
        Try again
      </Button>
    </div>
  )
}
