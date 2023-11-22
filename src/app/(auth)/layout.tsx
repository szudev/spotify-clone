import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { SpotifyLogo } from '@/components/Icons'
import Providers from '@/components/Providers'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Login - Spotify Clone',
  description: 'Sign in to Spotify-Clone'
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
            <Link href={'/'}>
              <SpotifyLogo className='md:w-[117px] w-[78px]' />
            </Link>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  )
}
