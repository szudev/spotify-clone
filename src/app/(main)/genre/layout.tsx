import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className='flex flex-col gap-6 to-zinc-900 bg-gradient-to-b from-[#222222] md:px-6 px-4 pb-4 md:pt-16 pt-8 min-h-full'>
      {children}
      <section className='py-8'>
        <div className='[border-top:1px_solid_rgba(255,255,255,.15)] pt-8 text-sm text-zinc-400 flex items-center flex-wrap justify-between'>
          <div className='flex flex-wrap gap-4 items-center justify-center'>
            <p className='cursor-pointer hover:text-white'>Legal</p>
            <p className='cursor-pointer hover:text-white'>Privacy Center</p>
            <p className='cursor-pointer hover:text-white'>Privacy Police</p>
            <p className='cursor-pointer hover:text-white'>Cookies</p>
            <p className='cursor-pointer hover:text-white'>About Ads</p>
            <p className='cursor-pointer hover:text-white'>Accessibility</p>
          </div>
          <p>© 2023 Fake-Spotify AB</p>
        </div>
      </section>
    </main>
  )
}
