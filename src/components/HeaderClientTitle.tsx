'use client'

import { headerTitleState } from '@/store/atoms/header-title-atom'
import { scrollBehaviourState } from '@/store/atoms/main-scroll-atom'
import { useAtomValue } from 'jotai'
import { usePathname } from 'next/navigation'

export default function HeaderClientTitle() {
  const pathname = usePathname()
  const headerTitle = useAtomValue(headerTitleState)
  const scrollState = useAtomValue(scrollBehaviourState)
  return (
    <div className='text-white table table-fixed w-full'>
      {(pathname.startsWith('/playlist/') || pathname.startsWith('/album/')) &&
      headerTitle &&
      scrollState.isScrolled ? (
        <strong className='text-white text-xl truncate block'>
          {headerTitle}
        </strong>
      ) : null}
    </div>
  )
}
