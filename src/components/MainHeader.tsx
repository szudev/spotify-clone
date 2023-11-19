import { Button } from './Button'
import { BackArrowIcon, ForwardArrowIcon } from './Icons'

export default function MainHeader() {
  return (
    <>
      <div className='flex items-center justify-center'>
        <Button className='rounded-full bg-hover-effect p-2 text-zinc-400 hover:text-zinc-100'>
          <BackArrowIcon className='h-4 w-4' />
        </Button>
        <Button className='rounded-full bg-hover-effect p-2 text-zinc-400 hover:text-zinc-100'>
          <ForwardArrowIcon className='h-4 w-4' />
        </Button>
      </div>
      <Button className='flex items-center hover:bg-opacity-80 justify-center py-3 px-5 rounded-full bg-white text-zinc-900 -tracking-wide font-semibold'>
        Log in
      </Button>
    </>
  )
}
