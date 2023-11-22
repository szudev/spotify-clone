import { User as UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from './ui/Avatar'
import Image from 'next/image'
import { AvatarProps } from '@radix-ui/react-avatar'
import { User } from 'next-auth'

interface Props extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
  sizes?: string
}

export default function UserAvatar({ user, sizes, ...props }: Props) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          <Image
            fill
            src={user.image}
            alt='profile picture'
            referrerPolicy='no-referrer'
            sizes={sizes}
          />
        </div>
      ) : (
        <AvatarFallback className='bg-black'>
          <span className='sr-only'>{user?.name}</span>
          <UserIcon className='h-5 group-hover:scale-110 group-focus:scale-110 transition w-5 stroke-white' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
