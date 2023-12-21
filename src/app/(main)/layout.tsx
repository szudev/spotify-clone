import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AsideMenu from '@/components/AsideMenu'
import Providers from '@/components/Providers'
import MainContent from '@/components/MainContent'
import FooterContent from '@/components/FooterContent'
import { Toaster } from '@/components/ui/toaster'
import HeaderMenu from '@/components/HeaderMenu'
import dynamic from 'next/dynamic'
import { MainHeaderSkeleton } from '@/components/ui/Skeletons'
import ServerMobileModal from '@/components/ServerMobileModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'Spotify Clone app'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const MainHeader = dynamic(() => import('@/components/MainHeader'), {
    ssr: false,
    loading: () => <MainHeaderSkeleton />
  })

  return (
    <html lang='en'>
      <body
        className={`${inter.className} grid md:[grid-template-areas:'aside_main_main'_'footer_footer_footer'] [grid-template-areas:'header'_'main'] md:grid-cols-[250px_1fr] grid-cols-[1fr] md:grid-rows-[1fr_auto] grid-rows-[auto_1fr] h-[100svh] relative p-0 md:p-2 md:gap-2 gap-0 md:bg-black bg-zinc-900`}
      >
        <Providers>
          <aside className='[grid-area:aside] hidden md:flex flex-col overflow-y-auto flex-1'>
            <AsideMenu />
          </aside>
          <header className='md:hidden [grid-area:header] w-full flex px-4 py-2'>
            <HeaderMenu />
          </header>
          <div className='flex relative md:rounded-lg rounded-none flex-col overflow-y-hidden [grid-area:main]'>
            <MainHeader />
            <MainContent>{children}</MainContent>
          </div>
          <footer className='md:[grid-area:footer] z-[999] md:z-0 absolute md:static bottom-0 w-full md:bg-black from-transparent to-black/100 bg-gradient-to-b'>
            <FooterContent />
          </footer>
          <ServerMobileModal />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
