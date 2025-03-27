"use client"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

export function OrganizationMenu(): JSX.Element {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const displayName = `${user?.name ?? ""}`.trim() || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex max-w-[160px] items-center justify-center gap-2 px-3 transition-all duration-300 ease-in-out"
        )}
      >
        <span className="truncate">{displayName}</span>
        <Icons.chevronDown aria-hidden="true" className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem asChild>
          <Link href="/app/profile">
            <Icons.user className="mr-2 h-4 w-4" />
            Profile
          </Link>
      </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/app/settings")}>
          <Icons.settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="text-red-500"
        >
          <Icons.logout className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
