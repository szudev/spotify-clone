import SessionMenu from './SessionMenu'
import ClientHeaderProvider from './ClientHeaderProvider'
import { Suspense } from 'react'
import SessionMenuLoader from '@/app/(main)/loading'

export default function MainHeader() {
  return (
    <ClientHeaderProvider>
      <Suspense fallback={<SessionMenuLoader />}>
        <SessionMenu />
      </Suspense>
    </ClientHeaderProvider>
  )
}
