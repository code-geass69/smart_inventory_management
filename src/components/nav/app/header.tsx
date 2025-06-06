import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { OrganizationMenu } from "@/components/nav/app/menus/organization-menu"
import { QuickCreateMenu } from "@/components/nav/app/menus/quick-create-menu"
import { Search } from "@/components/search"
import { InstantHelperMenu } from "@/components/nav/app/menus/instant-helper-menu"

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-[50] flex h-20 items-center justify-between gap-8 border-b bg-tertiary px-5">
      <div className="flex h-full items-center gap-2">
        <CustomTooltip text="Recent Activity">
          <Link
            aria-label="Recent Activity"
            href="/app/home/updates"
            className={cn(buttonVariants({ variant: "outline" }), "p-3")}
          >
            <Icons.alertTriangle aria-hidden="true" className="h-4 w-4 text-yellow-400" />
          </Link>
        </CustomTooltip>
        <QuickCreateMenu />

        <Search />
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center">
       
      <div className="flex items-center justify-center">
        <InstantHelperMenu />
        </div>
        </div>
        <OrganizationMenu />
      </div>
    </header>
  )
}
