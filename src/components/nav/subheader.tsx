import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { InstantHelperMenu } from "@/components/nav/app/menus/instant-helper-menu"

interface SubheaderProps {
  buttonText: string
  buttonLink: string
  loading?: boolean
  onClick?: () => void
}

export function Subheader({
  buttonText,
  buttonLink,
  loading = false,
  onClick,
}: SubheaderProps): JSX.Element {
  return (
    <div className="flex h-20 w-full items-center justify-end border-b bg-tertiary px-5">
      <div className="flex items-center gap-2">
        <CustomTooltip text="Add New Category">
          <button
            onClick={onClick}
            disabled={loading}
            className={cn(buttonVariants(), "gap-1 flex items-center")}
            aria-label="Add new item"
          >
            {loading ? (
              <>
                <Icons.spinner className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Icons.plus className="h-4 w-4" aria-hidden="true" />
                <span>{buttonText}</span>
              </>
            )}
          </button>
        </CustomTooltip>

        <InstantHelperMenu />
      </div>
    </div>
  )
}
