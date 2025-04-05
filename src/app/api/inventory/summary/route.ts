import { db } from "@/db"
import { items, categories, brands, warehouses } from "@/db/schema"
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [itemsCount] = await db.select({ count: sql<number>`count(*)` }).from(items)
    const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categories)
    const [brandCount] = await db.select({ count: sql<number>`count(*)` }).from(brands)
    const [warehouseCount] = await db.select({ count: sql<number>`count(*)` }).from(warehouses)
    const [lowStockCount] = await db.select({ count: sql<number>`count(*)` })
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
    return NextResponse.json({ error: "Error fetching summary" }, { status: 500 })
  }
}
