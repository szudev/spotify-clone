import type { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'

type AccessToken = string
type RefreshToken = string

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: AccessToken
    refreshToken?: RefreshToken
    accessTokenExpires?: number
    username: string | null
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & {
      accessToken: AccessToken | undefined
      refreshToken: RefreshToken | undefined
      username?: string | null
    }
  }
}
