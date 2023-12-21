import { getAuthSession } from '@/lib/auth'
import HeaderClientTitle from './HeaderClientTitle'
import { redirect } from 'next/navigation'
import HeaderClientAvatar from './HeaderClientAvatar'

export default async function HeaderMenu() {
  const session = await getAuthSession()
  if (!session?.user || !session) return redirect('/login')

  return (
    <div className='flex items-center gap-2'>
      <HeaderClientAvatar user={session.user} />
      <HeaderClientTitle />
    </div>
  )
}
