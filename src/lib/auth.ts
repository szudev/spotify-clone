import { getServerSession, NextAuthOptions } from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from './spotify'
import { JWT } from 'next-auth/jwt'

async function refreshAccessToken(token: JWT) {
  try {
    if (!token.accessToken || !token.refreshToken) throw new Error()
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      error: false
    }
  } catch (error) {
    //await signOut({ callbackUrl: '/login' })
    return {
      ...token,
      error: true
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: LOGIN_URL
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //initial sign in
      if (account && user && account.expires_at) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
          error: false
        }
      }
      //return previous token if the access token has not expired yet
      if (token.accessTokenExpires) {
        if (Date.now() < token.accessTokenExpires) {
          return token
        }
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    }
  }
}

export const getAuthSession = () => getServerSession(authOptions)
