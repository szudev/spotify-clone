'use client'

import { getGreetingTime } from '@/lib/utils'

export default function GreetingTime() {
  return (
    <h1 className='text-white text-xl font-semibold'>{getGreetingTime()}</h1>
  )
}
