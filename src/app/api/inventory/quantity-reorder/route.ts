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

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching quantity vs reorder data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
