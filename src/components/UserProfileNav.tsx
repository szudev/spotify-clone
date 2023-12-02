'use client'

import { User } from 'next-auth'
import { Button } from './Button'
import UserAvatar from './UserAvatar'
import { signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/DropDownMenu'
import Link from 'next/link'

interface Props {
  user: User
}

const handleLogout = async (event: Event) => {
  event.preventDefault()
  await signOut({ callbackUrl: `${window.location.origin}/login` })
}

export default function UserProfileNav({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar sizes='32px' user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='bg-[#282828] z-[999] border-none flex flex-col p-2 gap-2 font-medium'
        align='end'
      >
        <DropdownMenuItem
          className='cursor-pointer text-zinc-400 rounded-md focus:text-zinc-100 focus:bg-[#3E3E3E] text-base'
          asChild
        >
          <Link href='#'>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='cursor-pointer text-zinc-400 rounded-md text-base focus:text-zinc-100 focus:bg-[#3E3E3E]'
          asChild
        >
          <Link href={'#'}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-[#3E3E3E]' />
        <DropdownMenuItem
          className='cursor-pointer text-zinc-400 rounded-md text-base focus:text-zinc-100 focus:bg-[#3E3E3E]'
          onSelect={handleLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
