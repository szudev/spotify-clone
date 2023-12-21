'use client'

import { mobileModalMenuState } from '@/store/atoms/mobile-modal-menu'
import { useAtom } from 'jotai'
import { Button } from './Button'
import { signOut } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import { User } from 'next-auth'
import { cn } from '@/lib/utils'
import { HistoryIcon, LogOutIcon, SettingsIcon, ZapIcon } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Props {
  user: User & {
    accessToken: string | undefined
    refreshToken: string | undefined
    username?: string | null | undefined
  }
}

export default function MobileModalMenu({ user }: Props) {
  const [mobileModalValue, setMobileModalValue] = useAtom(mobileModalMenuState)

  const handleSignOutButton = async () => {
    const response = await signOut()
    if (response === undefined) setMobileModalValue(false)
    else
      toast({
        title: 'Signout error',
        description: 'There was an error in the signout, try again later.',
        variant: 'destructive'
      })
  }

  return (
    <aside
      className={cn(
        'md:hidden flex -translate-x-full transition-all ease-in-out absolute py-2 top-0 z-[1000] flex-1 w-full h-full bg-zinc-900',
        {
          '-translate-x-0': mobileModalValue
        }
      )}
    >
      <div className='flex flex-col justify-between w-full'>
        <div className='flex flex-col'>
          <div className='flex gap-2 px-4 w-full pb-2 [border-bottom:1px_solid_rgba(255,255,255,.15)]'>
            <UserAvatar
              sizes='32px'
              user={user}
              onClick={() => setMobileModalValue(false)}
            />
            <div className='flex flex-col gap-0 justify-center overflow-x-hidden'>
              <p className='text-white font-medium truncate'>{user.name}</p>
              <p className='text-zinc-400 text-xs'>Profile</p>
            </div>
          </div>
          <div className='px-4 py-2 flex flex-col'>
            <Button className='text-white font-medium focus:brightness-150 focus:outline-blue-950 py-2 flex gap-2'>
              <ZapIcon />
              Novedades
            </Button>
            <Button className='text-white font-medium py-2 flex gap-2 focus:brightness-150 focus:outline-blue-950'>
              <HistoryIcon />
              Playback history
            </Button>
            <Button className='text-white font-medium py-2 flex gap-2 focus:brightness-150 focus:outline-blue-950'>
              <SettingsIcon />
              Settings and privacy
            </Button>
          </div>
        </div>
        <div className='px-4 [border-top:1px_solid_rgba(255,255,255,.15)] pt-2'>
          <Button
            className='text-zinc-400 focus:text-white focus:brightness-150 focus:outline-blue-950 py-2 items-center tracking-wider justify-center flex gap-1 font-medium bg-black w-full rounded-md'
            onClick={handleSignOutButton}
          >
            <LogOutIcon className='h-4 w-4' /> Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
