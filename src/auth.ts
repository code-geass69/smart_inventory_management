import type { UserRole } from "@/types/auth"

import NextAuth from "next-auth"
import { linkOAuthAccount } from "@/actions/auth"
import { getUserById } from "@/actions/users"
import { db } from "@/db/index"
import { env } from "@/env.mjs"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

import authConfig from "@/config/auth"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    verifyRequest: "/signin/magic-link-signin",
    error: "/error",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async linkAccount({ user }) {
      await linkOAuthAccount(user.id)
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id)
      return !!existingUser?.emailVerified
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role
      token.firstName = existingUser.name
      token.lastName = existingUser.surname

      return token
    },

    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub
      if (session.user && token.role) session.user.role = token.role as UserRole

      session.user.firstName = token.firstName as string
      session.user.lastName = token.lastName as string

      return session
    },
  },
  adapter: DrizzleAdapter(db),
  ...authConfig,
})
