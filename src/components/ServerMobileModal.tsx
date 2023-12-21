import { getAuthSession } from '@/lib/auth'
//import MobileModalMenu from './MobileModalMenu'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

export default async function ServerMobileModal() {
  const session = await getAuthSession()
  if (!session || !session.user) return notFound()

  const MobileModalMenu = dynamic(() => import('./MobileModalMenu'), {
    ssr: false
  })

  return <MobileModalMenu user={session.user} />
}
