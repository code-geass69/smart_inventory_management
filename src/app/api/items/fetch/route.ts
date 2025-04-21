// src/app/api/items/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { items, categories, brands, warehouses } from "@/db/schema"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    // Fetch items with related category, brand, and warehouse data
    const availableItems = await db
      .select({
        itemId: items.id,
        itemName: items.name,
        categoryName: categories.name,
        brandName: brands.name,
        warehouseLocation: warehouses.location,
        sellingPrice: items.sellingPrice,
        purchasePrice: items.purchasePrice,
      })
      .from(items)
      .leftJoin(categories, sql`${items.categoryId} = ${categories.id}`) 
      .leftJoin(brands, sql`${items.brandId} = ${brands.id}`)
      .leftJoin(warehouses, sql`${items.warehouseId} = ${warehouses.id}`)  

    return NextResponse.json({ status: "success", data: availableItems })
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ status: "error", message: "Error fetching items" }, { status: 500 })
  }
}
