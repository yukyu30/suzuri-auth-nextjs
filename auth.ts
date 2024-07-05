import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
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
})
