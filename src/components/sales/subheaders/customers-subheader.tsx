import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { ItemsDropdown } from "@/components/inventory/dropdowns/items-dropdown"
import { ItemsSelect } from "@/components/inventory/selects/items-select"
import { ViewToggle } from "@/components/inventory/view-toggle"
import { InstantHelperMenu } from "@/components/nav/app/menus/instant-helper-menu"

export function CustomersSubheader(): JSX.Element {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b bg-tertiary px-5">
      <ItemsSelect />

      <div className="flex items-center gap-2">
        <CustomTooltip text="Add New Customer">
          <Link
            href="/app/sales/customers/new-customer"
            className={cn(buttonVariants(), "gap-1")}
            aria-label="Add new item"
          >
            <Icons.plus aria-hidden="true" className="h-4 w-4" />
            <span>New</span>
          </Link>
        </CustomTooltip>

        <ViewToggle />
        <ItemsDropdown />
        <InstantHelperMenu />
      </div>
    </div>
  )
}
