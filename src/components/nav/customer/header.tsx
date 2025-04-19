"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { CustomTooltip } from "@/components/custom-tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search } from "@/components/search"

export function CustomerHeader(): JSX.Element {
  const [customerName, setCustomerName] = useState("Customer")
  const router = useRouter()

  useEffect(() => {
    const fetchCustomerName = async () => {
      const email = localStorage.getItem("customerEmail")
      if (!email) return

      try {
        const res = await fetch(`/api/customers/name?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        if (res.ok && data.name) {
          setCustomerName(data.name)
        }
      } catch (error) {
        console.error("Failed to fetch customer name:", error)
      }
    }

    fetchCustomerName()
  }, [])

  return (
    <header className="sticky top-0 z-[50] flex h-20 items-center justify-between gap-8 border-b bg-[#0B0F19] px-5 text-white">
      {/* LEFT SECTION: Icon + Search */}
      <div className="flex items-center gap-4 flex-1">
        <CustomTooltip text="Order Status">
          <Link
            aria-label="Order Status"
            href="/customer/orders"
            className={cn(buttonVariants({ variant: "outline" }), "p-3")}
          >
            <Icons.recentActivities className="h-4 w-4" aria-hidden="true" />
          </Link>
        </CustomTooltip>

        <div className="w-full max-w-md">
          <Search />
        </div>
      </div>

      {/* RIGHT SECTION: Dropdown */}
      <div className="flex items-center gap-4 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "flex max-w-[160px] items-center justify-center gap-2 px-3 transition-all duration-300 ease-in-out"
            )}
          >
            <span className="truncate">{customerName}</span>
            <Icons.chevronDown aria-hidden="true" className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/customer/profile">
                <Icons.user className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/customer/settings")}>
              <Icons.settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                localStorage.clear()
                signOut({ callbackUrl: "/login" })
              }}
              className="text-red-500"
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
