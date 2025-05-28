import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import { getUserByEmail } from "@/actions/users"
import { env } from "@/env.mjs"
import { signInWithPasswordSchema } from "@/validations/auth"
import bcryptjs from "bcryptjs"

import { resend } from "@/config/email"
import { siteConfig } from "@/config/site"
import { MagicLinkEmail } from "@/components/emails/magic-link-email"

export default {
  providers: [
    CredentialsProvider({
      async authorize(rawCredentials) {
        const validatedCredentials =
          signInWithPasswordSchema.safeParse(rawCredentials)

        if (validatedCredentials.success) {
          const user = await getUserByEmail(validatedCredentials.data.email)
          if (!user || !user.passwordHash) return null

          const passwordIsValid = await bcryptjs.compare(
            validatedCredentials.data.password,
            user.passwordHash
          )

          if (passwordIsValid) return user
        }
        return null
      },
    }),
    EmailProvider({
      type: "email",
      server: {
        host: env.RESEND_HOST,
        port: Number(env.RESEND_PORT),
        auth: {
          user: env.RESEND_USERNAME,
          pass: env.RESEND_API_KEY,
        },
      },
      async sendVerificationRequest({
        identifier,
        url,
      }: {
        identifier: string
        url: string
      }) {
        try {
          await resend.emails.send({
            from: env.RESEND_EMAIL_FROM,
            to: [identifier],
            subject: `${siteConfig.name} magic link sign in`,
            react: MagicLinkEmail({ identifier, url }),
          })

          console.log("Verification email sent")
        } catch (error) {
          throw new Error("Failed to send verification email")
        }
      },
    }),
  ],
} satisfies NextAuthConfig
