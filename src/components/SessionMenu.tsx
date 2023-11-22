import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'
import UserProfileNav from './UserProfileNav'

export default async function SessionMenu() {
  const session = await getAuthSession()
  return (
    <div className='flex items-center justify-center'>
      {session?.user ? (
        <UserProfileNav user={session.user} />
      ) : (
        <Link
          href={'/login'}
          className='flex items-center hover:bg-opacity-80 justify-center py-3 px-5 rounded-full bg-white text-zinc-900 -tracking-wide font-semibold'
        >
          Log in
        </Link>
      )}
    </div>
  )
}
