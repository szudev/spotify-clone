import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
}

export function Button({
  className,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn('font-medium transition duration-300', className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
      {children}
    </button>
  )
}
