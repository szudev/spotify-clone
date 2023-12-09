'use client'

import { usePathname } from 'next/navigation'

export default function HeaderClientTitle() {
  const pathname = usePathname()
  return <div className='text-white'>{pathname === '/' ? '' : 'IDK'}</div>
}
