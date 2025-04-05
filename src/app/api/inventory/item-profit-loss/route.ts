import { db } from "@/db"
import { items } from "@/db/schema"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db.select({
      name: items.name,
      sellingPrice: items.sellingPrice,
      purchasePrice: items.purchasePrice,
    }).from(items)

    const profitLossData = result.map((item) => ({
      name: item.name,
      profit: item.sellingPrice - item.purchasePrice,
    }))

    return NextResponse.json(profitLossData)
  } catch (error) {
    console.error("Error fetching profit/loss:", error)
    return NextResponse.json({ error: "Failed to fetch profit/loss data" }, { status: 500 })
  }
}
