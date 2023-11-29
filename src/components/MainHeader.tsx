import SessionMenu from './SessionMenu'
import ClientHeaderProvider from './ClientHeaderProvider'

export default function MainHeader() {
  return (
    <ClientHeaderProvider>
      <SessionMenu />
    </ClientHeaderProvider>
  )
}
