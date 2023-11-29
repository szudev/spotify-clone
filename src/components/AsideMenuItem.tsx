import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
}

export default function AsideMenuItem({ href, children }: Props) {
  return (
    <li>
      <Link
        href={href}
        className='flex gap-4 text-zinc-400 hover:text-zinc-100 items-center font-medium transition duration-300'
      >
        {children}
      </Link>
    </li>
  )
}
