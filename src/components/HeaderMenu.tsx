import { getAuthSession } from '@/lib/auth'
import UserAvatar from './UserAvatar'
import HeaderClientTitle from './HeaderClientTitle'
import { redirect } from 'next/navigation'

export default async function HeaderMenu() {
  const session = await getAuthSession()
  if (!session?.user || !session) return redirect('/login')

  return (
    <div className='flex items-center gap-2'>
      <UserAvatar sizes='32px' user={session.user} />
      <HeaderClientTitle />
    </div>
  )
}
