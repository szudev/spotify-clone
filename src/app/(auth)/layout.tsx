import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Login - Szudev Music',
  description: 'Sign in to Szudev Music'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className={`${inter.className}`}>
      <body className='min-h-[100svh] flex flex-col bg-black md:bg-transparent'>
        <Providers>
          <header className='bg-black flex items-center md:px-[51px] md:py-8 md:mb-0 mb-[10px] pt-12 px-8'>
            <div className='rounded-full p-2 outline outline-zinc-200'>
              <strong className='text-white'>Szudev Music</strong>
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  )
}
