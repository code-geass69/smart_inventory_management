// src/app/(app)/app/inventory/brands/page.tsx

import * as React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { asc, desc, like, sql } from "drizzle-orm"

import { auth } from "@/auth"
import { db } from "@/db"
import { brands, type Brand } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { Subheader } from "@/components/nav/subheader"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { BrandsTableShell } from "@/components/data-table/table-shells/brands-table-shell"
import { brandsSearchParamsSchema } from "@/validations/params"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Brands",
  description: "Manage your product brands",
}

interface AppInventoryBrandsPageProps {
  searchParams: SearchParams
}

export default async function AppInventoryBrandsPage({
  searchParams,
}: AppInventoryBrandsPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  const { page, per_page, sort, name } =
    brandsSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [
    keyof Brand | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: brands.id,
      name: brands.name,
      category: brands.category,
    })
    .from(brands)
    .limit(limit)
    .offset(offset)
    .where(name ? like(brands.name, `%${name}%`) : undefined)
    .orderBy(
      column && column in brands
        ? order === "asc"
          ? asc(brands[column])
          : desc(brands[column])
        : desc(brands.id)
    )

  noStore()
  const count = await db
    .select({ count: sql<number>`count(${brands.id})` })
    .from(brands)
    .where(name ? like(brands.name, `%${name}%`) : undefined)
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div>
      <Subheader
        buttonText="New Brand"
        buttonLink="/app/inventory/brands/new-brand"
      />
      <div className="p-5">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={3}
              isNewRowCreatable={false}
              isRowsDeletable={true}
            />
          }
        >
          <BrandsTableShell data={data} pageCount={pageCount} />
        </React.Suspense>
      </div>
    </div>
  )
}