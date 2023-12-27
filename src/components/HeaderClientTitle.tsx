'use client'

import { headerTitleState } from '@/store/atoms/header-title-atom'
import { scrollBehaviourState } from '@/store/atoms/main-scroll-atom'
import { useAtomValue } from 'jotai'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SearchBar from './ui/SearchBar'
import { genres } from '@/lib/constants'

export default function HeaderClientTitle() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
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
      {pathname.startsWith('/search') &&
      (!searchParams.has('q') ||
        searchParams.get('q') === '' ||
        !genres.includes(searchParams.get('q') ?? '')) ? (
        <SearchBar
          router={router}
          pathname={pathname}
          searchParams={searchParams}
        />
      ) : null}
    </div>
  )
}
