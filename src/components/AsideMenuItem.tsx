import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

export default function AsideMenuItem({ href, children, className }: Props) {
  return (
    <li className='list-none'>
      <Link
        href={href}
        className={cn(
          'flex gap-4 text-zinc-400 hover:text-zinc-100 items-center font-medium transition duration-300',
          className
        )}
      >
        {children}
      </Link>
    </li>
  )
}
