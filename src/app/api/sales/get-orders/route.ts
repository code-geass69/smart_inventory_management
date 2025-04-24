import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { customers, orders } from "@/db/schema"
import { AnyColumn, asc, desc, like, sql } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    page = 1,
    perPage = 10,
    sort = "createdAt.desc",
    orderId,
    customerName,
  } = body

  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  const limit = isNaN(perPage) ? 10 : perPage
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  const [column, order] = (sort?.split(".") as [string, "asc" | "desc"]) ?? [
    "createdAt",
    "desc",
  ]

  try {
    const data = await db
      .select({
        id: orders.id,
        orderId: orders.id,
        customerId: orders.customerId,
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
      .where(
        sql`${orderId ? like(orders.id, `%${orderId}%`) : sql`true`} AND ${
          customerName ? like(customers.name, `%${customerName}%`) : sql`true`
        }`
      )
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column as keyof typeof orders] as AnyColumn)
            : desc(orders[column as keyof typeof orders] as AnyColumn)
          : desc(orders.id)
      )

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .innerJoin(customers, sql`${customers.id} = ${orders.customerId}`)
      .where(
        sql`${orderId ? like(orders.id, `%${orderId}%`) : sql`true`} AND ${
          customerName ? like(customers.name, `%${customerName}%`) : sql`true`
        }`
      )
      .then((res) => res[0]?.count ?? 0)

    return NextResponse.json({ data, count })
  } catch (error) {
    console.error("Get Orders API Error:", error)
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
