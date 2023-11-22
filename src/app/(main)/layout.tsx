import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import AsideMenu from '@/components/AsideMenu'
import MainHeader from '@/components/MainHeader'
import Providers from '@/components/Providers'
import MainContent from '@/components/MainContent'

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
  return (
    <html lang='en'>
      <body
        className={`${inter.className} grid md:[grid-template-areas:'aside_main_main'_'footer_footer_footer'] [grid-template-areas:'aside'_'main'_'footer'] md:grid-cols-[250px_1fr] grid-cols-[1fr] md:grid-rows-[1fr_auto] grid-rows-[auto_1fr_auto] h-[100svh] relative p-2 gap-2 bg-black`}
      >
        <Providers>
          <aside className='[grid-area:aside] flex flex-col overflow-y-auto'>
            <AsideMenu />
          </aside>
          <div className='flex relative rounded-lg flex-col overflow-y-hidden [grid-area:main]'>
            <MainHeader />
            <MainContent>{children}</MainContent>
          </div>
          <footer className='[grid-area:footer] md:bg-black bg-[rgba(0,0,0,.8)] md:backdrop-blur-none backdrop-blur-[5px]'>
            FOOTER
          </footer>
        </Providers>
      </body>
    </html>
  )
}
