'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none h-full items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-zinc-700'>
      <SliderPrimitive.Range className='absolute h-full bg-white group-hover:bg-[#1ed760] group-focus:bg-[#1ed760]' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='hidden group-hover:block group-focus:block hover:block focus:block h-3 w-3 rounded-full outline-none bg-white transition-colors disabled:pointer-events-none' />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
