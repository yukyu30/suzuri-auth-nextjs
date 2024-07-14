import NextAuth, { DefaultSession } from "next-auth"
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken: string
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: <'jwt'>'jwt' },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id
      session.accessToken = token.accessToken
      return session
    },
    async jwt({
      token,
      user,
      account,
    }: {
      token: any
      user: any
      account: any
    }) {
      if (user) {
        token.id = user.id
      }

      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
  },
  providers: [{
    id: 'suzuri',
    name: 'SUZURI',
    type: 'oauth',
    authorization: {
      url: 'https://suzuri.jp/oauth/authorize',
      params: { scope: 'read write' },
    },
    token: 'https://suzuri.jp/oauth/token',
    clientId: process.env.SUZURI_CLIENT_ID,
    clientSecret: process.env.SUZURI_CLIENT_SECRET,
    userinfo: 'https://suzuri.jp/api/v1/user',
    profile(res: any) {
      return {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        image: res.user.avatarUrl,
      }
    },
  }],
  //ここわかっていない
  cookies: {
    pkceCodeVerifier: {
      name: 'pkce_code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})

