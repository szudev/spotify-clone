import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn('font-medium transition duration-300', className)}
      {...props}
    >
      {children}
    </button>
  )
}
