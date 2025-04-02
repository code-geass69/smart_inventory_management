// src/app/api/items/import/route.ts
import { NextResponse } from "next/server"
import { db } from "@/db"
import { items } from "@/db/schema"

export async function POST(req: Request) {
  const { items: rawItems } = await req.json()

  // Validate and process each item from the CSV
  const itemsToInsert = rawItems.map((item: any) => ({
    name: item.name,
    categoryId: parseInt(item.categoryId, 10),
    brandId: parseInt(item.brandId, 10),
    barcode: item.barcode,
    description: item.description,
    sellingPrice: parseFloat(item.sellingPrice),
    purchasePrice: parseFloat(item.purchasePrice),
    taxRate: parseFloat(item.taxRate),
    width: parseFloat(item.width),
    height: parseFloat(item.height),
    depth: parseFloat(item.depth),
    dimensionsUnit: item.dimensionsUnit,
    weight: parseFloat(item.weight),
    weightUnit: item.weightUnit,
    warehouse: item.warehouse,
    sku: item.sku,
    quantity: parseInt(item.quantity, 10),
    unit: item.unit,
    reorderPoint: parseInt(item.reorderPoint, 10),
    supplier: item.supplier,
    notes: item.notes,
  }))

  try {
    await db.insert(items).values(itemsToInsert)
    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("Error importing items:", error)
    return NextResponse.json({ status: "error" })
  }
}
