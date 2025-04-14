import * as React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { asc, desc, like, sql } from "drizzle-orm"

import { auth } from "@/auth"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { env } from "@/env.mjs"
import type { SearchParams } from "@/types"
import { Subheader } from "@/components/nav/subheader"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { CustomerTableShell } from "@/components/data-table/table-shells/customer-table-shell"
import { customerSearchParamsSchema } from "@/validations/params"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Customers",
  description: "View and manage all customers",
}

interface AppSalesCustomersPageProps {
  searchParams: SearchParams
}

export default async function AppSalesCustomersPage({
  searchParams,
}: AppSalesCustomersPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  const { page, per_page, sort, name } = customerSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [keyof typeof customers | undefined, "asc" | "desc" | undefined]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select()
    .from(customers)
    .where(name ? like(customers.name, `%${name}%`) : undefined)
    .orderBy(
      column && column in customers
        ? order === "asc"
          ? asc(customers[column])
          : desc(customers[column])
        : desc(customers.id)
    )
    .limit(limit)
    .offset(offset)

  noStore()
  const count = await db
    .select({ count: sql<number>`count(${customers.id})` })
    .from(customers)
    .where(name ? like(customers.name, `%${name}%`) : undefined)
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  return (
    <div>
      <Subheader
        buttonText="New Customer"
        buttonLink="/app/sales/customers/new"
      />
      <div className="p-5">
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={4}
              isNewRowCreatable={true}
              isRowsDeletable={false}
            />
          }
        >
          <CustomerTableShell data={data} pageCount={pageCount} />
        </React.Suspense>
      </div>
    </div>
  )
}
