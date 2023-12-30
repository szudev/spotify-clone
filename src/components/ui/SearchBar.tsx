'use client'

import debounce from 'lodash/debounce'
import { SearchIcon } from '../Icons'
import { useCallback } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useAtom } from 'jotai'
import { searchBarAtom } from '@/store/atoms/search-bar-atom'
import { X } from 'lucide-react'
import { ReadonlyURLSearchParams } from 'next/navigation'

interface Props {
  router: AppRouterInstance
  pathname: string
  searchParams: ReadonlyURLSearchParams
}

export default function SearchBar({ router, pathname, searchParams }: Props) {
  const [input, setInput] = useAtom(searchBarAtom)

  const searchRequest = debounce(
    (
      queryParam: string,
      receivedPathname: string,
      receivedSearchParams: ReadonlyURLSearchParams
    ) => {
      if (queryParam === '') {
        if (receivedPathname === '/search' && !receivedSearchParams.has('q'))
          return
        return router.replace('/search')
      }
      return router.replace(`?q=${queryParam.toLowerCase()}`)
    },
    500
  )

  const debounceSearchRequests = useCallback(
    (
      queryParam: string,
      receivedPathname: string,
      receivedSearchParams: ReadonlyURLSearchParams
    ) => {
      searchRequest(queryParam, receivedPathname, receivedSearchParams)
    },
    []
  )

  const handleResetInput = () => {
    setInput('')
    searchRequest('', pathname, searchParams)
  }

  return (
    <div className='h-full flex items-center py-2 w-full'>
      <div className='rounded-full h-full items-center bg-[#2A2A2A] px-3 flex lg:w-1/2 md:w-[85%] w-full hover:[outline:1px_solid_rgba(255,255,255,.15)] focus-within:outline-white focus-within:outline focus-within:hover:outline-white focus-within:outline-2 focus-within:hover:outline focus-within:hover:outline-2'>
        <SearchIcon className='w-5 h-5 text-white' />
        <input
          className='flex text-sm text-white w-full px-2 flex-1 h-full bg-transparent py-3 rounded-full outline-none'
          placeholder='What do you want to listen to?'
          value={input}
          onChange={(text) => {
            setInput(text.currentTarget.value)
            debounceSearchRequests(
              text.currentTarget.value,
              pathname,
              searchParams
            )
          }}
        />
        {input !== '' ? (
          <X className='text-white w-5 h-5' onClick={handleResetInput} />
        ) : null}
      </div>
    </div>
  )
}
