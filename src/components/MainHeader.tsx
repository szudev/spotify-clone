import { Suspense } from 'react'
import SessionMenu from './SessionMenu'
import SessionMenuLoader from '@/app/(main)/loading'
import ClientHeaderProvider from './ClientHeaderProvider'

export default function MainHeader() {
  return (
    <ClientHeaderProvider>
      <Suspense fallback={<SessionMenuLoader />}>
        <SessionMenu />
      </Suspense>
    </ClientHeaderProvider>
  )
}
