import { NextResponse } from "next/server"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { sql } from "drizzle-orm/sql"

export async function PUT(request: Request) {
  try {
    const { orderId, newStatus } = await request.json()

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { message: "Order ID and new status are required." },
        { status: 400 }
      )
    }

    const result = await db
      .update(orders)
      .set({ orderStatus: newStatus })
      .where(sql`${orders.id} = ${orderId}`)
      .execute()

    if ((result as any).rowCount === 0) {
      return NextResponse.json(
        { message: "Order not found or status unchanged." },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Order status updated successfully." })
  } catch (error) {
    console.error("Failed to update order status:", error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
