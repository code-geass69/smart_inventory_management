import { NextResponse } from "next/server"
import { db } from "@/db"
import { brands, categories, items, warehouses } from "@/db/schema"
import { sql } from "drizzle-orm/sql"

export async function GET() {
  try {
    const [itemsCount = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
    const [categoryCount = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
    const [brandCount = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(brands)
    const [warehouseCount = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(warehouses)
    const [lowStockCount = { count: 0 }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(sql`${items.quantity} < ${items.reorderPoint}`)

    return NextResponse.json({
      totalItems: itemsCount.count,
      totalCategories: categoryCount.count,
      totalBrands: brandCount.count,
      totalWarehouses: warehouseCount.count,
      lowStockItems: lowStockCount.count,
    })
  } catch (error) {
    console.error("Failed to fetch summary stats:", error)
    return NextResponse.json(
      { error: "Error fetching summary" },
      { status: 500 }
    )
  }
}
