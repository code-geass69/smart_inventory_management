import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { items } from "@/db/schema"
import { sql } from "drizzle-orm"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  try {

    const item = await db
      .select()
      .from(items)
      .where(sql`${items.id} = ${Number(id)}`)
      .limit(1)
      .execute()

    if (item.length === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item[0])
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ message: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { name, quantity, reorderPoint, sku, sellingPrice } = await req.json()

  try {
    const updatedItem = await db
      .update(items)
      .set({ name, quantity, reorderPoint, sku, sellingPrice })
      .where(sql`${items.id} = ${Number(id)}`)
      .returning()
      .execute()

    if (updatedItem.length === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item updated successfully" })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ message: "Failed to update item" }, { status: 500 })
  }
}
