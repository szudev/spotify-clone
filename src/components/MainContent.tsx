import { ReactNode } from 'react'
import ClientBodyProvider from './ClientBodyProvider'

export default function MainContent({ children }: { children: ReactNode }) {
  return <ClientBodyProvider>{children}</ClientBodyProvider>
}
