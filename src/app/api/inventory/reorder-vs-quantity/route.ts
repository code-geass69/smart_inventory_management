import { db } from "@/db"
import { items } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await db.select({
      name: items.name,
      quantity: items.quantity,
      reorderPoint: items.reorderPoint,
    }).from(items)

    const lowStockItems = data.filter((item) => item.quantity <= item.reorderPoint)

    return NextResponse.json(lowStockItems)
  } catch (error) {
    console.error("Error fetching quantity vs reorder data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
