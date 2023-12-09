import { getAuthSession } from '@/lib/auth'
import UserAvatar from './UserAvatar'
import HeaderClientTitle from './HeaderClientTitle'
import { signOut } from 'next-auth/react'

export default async function HeaderMenu() {
  const session = await getAuthSession()
  if (!session?.user || !session)
    return await signOut({ callbackUrl: `/login` })

  return (
    <div className='flex items-center gap-2'>
      <UserAvatar sizes='32px' user={session.user} />
      <HeaderClientTitle />
    </div>
  )
}
