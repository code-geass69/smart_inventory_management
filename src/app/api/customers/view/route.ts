import { db } from "@/db"
import { orders } from "@/db/schema"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"

export async function GET(req: Request) {
  try {
    // Get the customerId from the query parameters
    const url = new URL(req.url)
    const customerId = url.searchParams.get("customerId")

    console.log("Received customerId:", customerId) // Log the customerId received

    if (!customerId || isNaN(Number(customerId))) {
      console.error("Invalid customerId provided:", customerId) // Log invalid customerId
      return NextResponse.json({ status: "error", message: "Invalid customerId provided" }, { status: 400 })
    }

    // Convert customerId to a number explicitly (important for query)
    const customerIdNumber = Number(customerId)

    // Log the customerId being passed to the query
    console.log("Fetching orders for customerId:", customerIdNumber)

    // Fetch orders for the given customerId using raw SQL condition
    const ordersData = await db
      .select()
      .from(orders)
      .where(sql`${orders.customerId} = ${customerIdNumber}`)  // Raw SQL condition for comparison

    console.log("Fetched orders data:", ordersData) // Log fetched orders data

    if (ordersData.length === 0) {
      console.warn("No orders found for customerId:", customerIdNumber) // Log if no orders are found
      return NextResponse.json({ status: "error", message: "No orders found" }, { status: 404 })
    }

    return NextResponse.json({ status: "success", data: ordersData })
  } catch (error) {
    console.error("Error fetching orders:", error) // Log any error that occurs
    return NextResponse.json({ status: "error", message: "Error fetching orders" }, { status: 500 })
  }
}
