import { db } from "@/db"
import { items } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.select({
      name: items.name,
      quantity: items.quantity,
      purchasePrice: items.purchasePrice,
    }).from(items)

    const valueData = result.map((item) => ({
      name: item.name,
      value: item.quantity * item.purchasePrice,
    }))

    return NextResponse.json(valueData)
  } catch (error) {
    console.error("Error fetching total value data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
