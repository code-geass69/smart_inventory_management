import { NextResponse } from "next/server"
import { db } from "@/db"
import { items } from "@/db/schema"

export async function GET() {
  try {
    const result = await db
      .select({
        name: items.name,
        sellingPrice: items.sellingPrice,
        purchasePrice: items.purchasePrice,
      })
      .from(items)

    const profitLossData = result.map((item) => ({
      name: item.name,
      profit: Number(item.sellingPrice) - Number(item.purchasePrice),
    }))

    return NextResponse.json(profitLossData)
  } catch (error) {
    console.error("Error fetching profit/loss:", error)
    return NextResponse.json(
      { error: "Failed to fetch profit/loss data" },
      { status: 500 }
    )
  }
}
