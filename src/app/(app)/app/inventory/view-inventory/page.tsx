import * as React from "react"
import { Metadata } from "next"
import { redirect, useRouter } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { asc, desc, like, sql } from "drizzle-orm"

import { auth } from "@/auth"
import { db } from "@/db"
import { items, categories, brands, type Item } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { Subheader } from "@/components/nav/subheader"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { InventoryTableShell } from "@/components/data-table/table-shells/inventory-table-shell"
import { inventorySearchParamsSchema } from "@/validations/params"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Inventory",
  description: "Manage your inventory items",
}

interface AppInventoryViewInventoryPageProps {
  searchParams: SearchParams
}

export default async function AppInventoryViewInventoryPage({
  searchParams,
}: AppInventoryViewInventoryPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  const { page, per_page, sort, name } = inventorySearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [keyof Item | undefined, "asc" | "desc" | undefined]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
  .select({
    id: items.id,
    name: items.name,
    category: categories.name, 
    brand: brands.name, 
    reorderPoint: items.reorderPoint, 
    sku: items.sku, 
    quantity: items.quantity,
    sellingPrice: items.sellingPrice,
    purchasePrice: items.purchasePrice,
    taxRate: items.taxRate,
    createdAt: items.createdAt,
    updatedAt: items.updatedAt,
    unit: items.unit,
  })
  .from(items)
  .innerJoin(categories, sql`${categories.id} = ${items.categoryId}`) 
  .innerJoin(brands, sql`${brands.id} = ${items.brandId}`) 
  .limit(limit)
  .offset(offset)
  .where(name ? like(items.name, `%${name}%`) : undefined)
  .orderBy(
    column && column in items
      ? order === "asc"
        ? asc(items[column])
        : desc(items[column])
      : desc(items.id)
  )
  noStore()
  const count = await db
    .select({ count: sql<number>`count(${items.id})` })
    .from(items)
    .where(name ? like(items.name, `%${name}%`) : undefined)
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div>
      <Subheader
        buttonText="New Inventory Item"
        buttonLink="/app/inventory/view-inventory/new-item"
      />
      <div className="p-5">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={8}
              isNewRowCreatable={true}
              isRowsDeletable={false}
            />
          }
        >
          <InventoryTableShell data={data} pageCount={pageCount} />
        </React.Suspense>
      </div>
    </div>
  )
}
