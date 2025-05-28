"use client"

import * as React from "react"
import Link from "next/link"

import { quickCreateItems } from "@/data/nav-items-app"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"

export function QuickCreateMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            showChevron={false}
            className={cn(buttonVariants({ variant: "outline" }), "p-3")}
          >
            <Icons.plus className="h-4 w-4" aria-hidden="true" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4">
  <div className="flex gap-6 w-full max-w-[100vw] overflow-x-auto">
    {quickCreateItems.map((item) => {
      const Icon = Icons[item.icon as keyof typeof Icons]
      return (
        <div key={item.title} className="min-w-[220px] shrink-0">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <Icon className="h-4 w-4" />
            {item.title}
          </div>
          <div className="flex flex-col gap-1">
            {item.subitems.map((subitem) => (
              <Link
                key={subitem.title}
                href={subitem.href}
                legacyBehavior
                passHref
              >
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "pl-6 text-muted-foreground hover:text-primary"
                  )}
                >
                  + {subitem.title}
                </NavigationMenuLink>
              </Link>
            ))}
          </div>
        </div>
      )
    })}
  </div>
</NavigationMenuContent>

        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
