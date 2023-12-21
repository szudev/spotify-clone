'use client'

import { User } from 'next-auth'
import UserAvatar from './UserAvatar'
import { useSetAtom } from 'jotai'
import { mobileModalMenuState } from '@/store/atoms/mobile-modal-menu'

interface Props {
  user: User & {
    accessToken: string | undefined
    refreshToken: string | undefined
    username?: string | null | undefined
  }
}

export default function HeaderClientAvatar({ user }: Props) {
  const setMobileModalState = useSetAtom(mobileModalMenuState)
  return (
    <UserAvatar
      sizes='32px'
      user={user}
      onClick={() => setMobileModalState(true)}
    />
  )
}
