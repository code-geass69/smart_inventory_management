"use client" 
import * as React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import { asc, desc, like, sql } from "drizzle-orm"

import { auth } from "@/auth"
import { db } from "@/db"
import { orders, customers } from "@/db/schema"
import { env } from "@/env.mjs"
import { salesOrdersSearchParamsSchema } from "@/validations/params"
import { Subheader } from "@/components/nav/subheader"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { SalesOrdersTableShell } from "@/components/data-table/table-shells/sales-orders-table-shell"
import { useToast } from "@/hooks/use-toast" // Import useToast for notifications
import type { SearchParams } from "@/types"
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Sales Orders",
  description: "Manage and view sales orders",
}

interface AppSalesOrdersViewPageProps {
  searchParams: SearchParams
}

export default async function AppSalesOrdersViewPage({
  searchParams,
}: AppSalesOrdersViewPageProps): Promise<JSX.Element> {
  const session = await auth()
  if (!session) redirect("/signin")

  const { page, per_page, sort, orderId, customerName } = salesOrdersSearchParamsSchema.parse(searchParams)

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(per_page) ? 10 : per_page
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const [column, order] = (sort?.split(".") as [keyof typeof orders | undefined, "asc" | "desc" | undefined]) ?? ["createdAt", "desc"]

  noStore()
  const data = await db
    .select({
      id: orders.id,
      orderId: orders.id,
      customerName: customers.name,
      totalPrice: orders.totalPrice,
      orderStatus: orders.orderStatus,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .innerJoin(customers, sql`${customers.id} = ${orders.customerId}`)
    .limit(limit)
    .offset(offset)
    .where(orderId ? like(orders.id, `%${orderId ?? ''}%`) : undefined)
    .where(customerName ? like(customers.name, `%${customerName ?? ''}%`) : undefined)
    .orderBy(
      column && column in orders
        ? order === "asc"
          ? asc(orders[column])
          : desc(orders[column])
        : desc(orders.id)
    )
  noStore()

  const count = await db
    .select({ count: sql<number>`count(${orders.id})` })
    .from(orders)
    .where(orderId ? like(orders.id, `%${orderId ?? ''}%`) : undefined)
    .where(customerName ? like(customers.name, `%${customerName ?? ''}%`) : undefined)
    .then((res) => res[0]?.count ?? 0)

  const pageCount = Math.ceil(count / limit)

  // Define the handleStatusChange function here
  const { toast } = useToast() // To show notifications
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/orders/update-status", {
        method: "PUT",
        body: JSON.stringify({ orderId, newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.message || "Failed to update status")
      }
    } catch (error) {
      toast.error("Error updating order status")
      console.error("Error:", error)
    }
  }

  return (
    <div>
      <Subheader
        buttonText="New Sales Order"
        buttonLink="/app/sales/sales-orders/new-order"
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
          <SalesOrdersTableShell
            data={data}
            pageCount={pageCount}
            onStatusChange={handleStatusChange} // Pass the handleStatusChange function here
          />
        </React.Suspense>
      </div>
    </div>
  )
}