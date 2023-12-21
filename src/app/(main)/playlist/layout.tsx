import { ReactNode } from 'react'

export default function PlaylistLayout({ children }: { children: ReactNode }) {
  return (
    <main className='flex flex-col bg-transparent min-h-full rounded-lg'>
      {children}
      <section className='py-8 bg-zinc-900 md:px-6 px-4'>
        <div className='[border-top:1px_solid_rgba(255,255,255,.15)] gap-4 pt-8 text-sm text-zinc-400 flex items-center flex-wrap md:justify-between justify-center'>
          <div className='md:flex md:flex-wrap grid grid-cols-3 md:gap-4 gap-2 text-center items-center justify-center'>
            <p className='cursor-pointer hover:text-white'>Legal</p>
            <p className='cursor-pointer hover:text-white'>Privacy Center</p>
            <p className='cursor-pointer hover:text-white'>Privacy Police</p>
            <p className='cursor-pointer hover:text-white'>Cookies</p>
            <p className='cursor-pointer hover:text-white'>About Ads</p>
            <p className='cursor-pointer hover:text-white'>Accessibility</p>
          </div>
          <p>© 2023 Fake-Spotify</p>
        </div>
      </section>
    </main>
  )
}
