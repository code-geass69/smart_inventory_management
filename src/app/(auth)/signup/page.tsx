import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { env } from "@/env.mjs"

import { DEFAULT_SIGNIN_REDIRECT } from "@/data/constants/index"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SignUpWithPasswordForm } from "@/components/forms/auth/signup-with-password-form"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sign Up",
  description: "Sign up for an account",
}

export default async function SignUpPage(): Promise<JSX.Element> {
  const session = await auth()
  if (session?.user) redirect(DEFAULT_SIGNIN_REDIRECT)

  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center md:flex">
      <Card className="max-sm:flex max-sm:w-full max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:rounded-none max-sm:border-none sm:min-w-[370px] sm:max-w-[368px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <Link href="/">
              <Icons.close className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-sm:w-full max-sm:max-w-[340px] max-sm:px-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative mb-3 mt-6 flex justify-center text-xs uppercase">
              <span className="bg-background px-2">
                Enter Details to Continue
              </span>
            </div>
          </div>
          <SignUpWithPasswordForm />
        </CardContent>
        <CardFooter className="grid w-full gap-4 text-sm text-muted-foreground max-sm:max-w-[340px] max-sm:px-10">
          <div>
            <div>
              <span> Already have an account? </span>
              <Link
                aria-label="Sign in"
                href="/signin"
                className="font-bold tracking-wide text-primary underline-offset-4 transition-all hover:underline"
              >
                Sign in
                <span className="sr-only">Sign in</span>
              </Link>
              .
            </div>
            <div>
              <span>Lost email verification link? </span>
              <Link
                aria-label="Resend email verification link"
                href="/signup/reverify-email"
                className="text-sm font-normal text-primary underline-offset-4 transition-colors hover:underline"
              >
                Resend
                <span className="sr-only">Resend email verification link</span>
              </Link>
              .
            </div>
            <div>
              <span>Go Back! </span>
              <Link
                aria-label="Home"
                href="/"
                className="text-sm font-normal text-primary underline-offset-4 transition-colors hover:underline"
              >
                Home
                <span className="sr-only">Home</span>
              </Link>
              .
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
