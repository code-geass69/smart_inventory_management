import { NextResponse } from "next/server"
import { db } from "@/db"
import { orders } from "@/db/schema"
import { sql } from "drizzle-orm/sql"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const customerId = url.searchParams.get("customerId")

    if (!customerId || isNaN(Number(customerId))) {
      console.error("Invalid customerId provided:", customerId)
      return NextResponse.json(
        { status: "error", message: "Invalid customerId provided" },
        { status: 400 }
      )
    }

    const customerIdNumber = Number(customerId)

    const ordersData = await db
      .select()
      .from(orders)
      .where(sql`${orders.customerId} = ${customerIdNumber}`)

    if (ordersData.length === 0) {
      console.warn("No orders found for customerId:", customerIdNumber)
      return NextResponse.json(
        { status: "error", message: "No orders found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ status: "success", data: ordersData })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { status: "error", message: "Error fetching orders" },
      { status: 500 }
    )
  }
}
