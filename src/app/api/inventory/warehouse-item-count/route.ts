// src/app/api/inventory/warehouse-item-count/route.ts

import { db } from "@/db"
import { items, warehouses } from "@/db/schema"
import { sql } from "drizzle-orm/sql"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await db
      .select({
        warehouseName: warehouses.name,
        itemCount: sql<number>`count(${items.id})`,
      })
      .from(items)
      .innerJoin(warehouses, sql`${warehouses.id} = ${items.warehouseId}`)
      .groupBy(warehouses.name)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching warehouse item counts:", error)
    return NextResponse.json({ error: "Failed to fetch warehouse item count" }, { status: 500 })
  }
}
