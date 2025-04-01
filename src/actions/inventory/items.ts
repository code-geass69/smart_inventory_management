"use server"
import { db } from '@/db' 
import { items, categories, brands, warehouses } from '@/db/schema'
import { unstable_noStore as noStore } from "next/cache"
import { extendedItemSchema } from "@/validations/inventory"
import { eq } from "drizzle-orm"
import type { z } from "zod"

export async function addItem(
  rawInput: z.infer<typeof extendedItemSchema>
): Promise<string> {
  const input = extendedItemSchema.parse(rawInput)

  console.log("Adding item to the database ...")

  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.name, input.category),
    })

    const brand = await db.query.brands.findFirst({
      where: eq(brands.name, input.brand),
    })

    const warehouse = await db.query.warehouses.findFirst({
      where: eq(warehouses.name, input.warehouse), // Find warehouse by name
    })

    if (!category || !brand || !warehouse) {
      throw new Error("Category, Brand, or Warehouse not found.")
    }

    await db.insert(items).values({
      name: input.name,
      categoryId: category.id,
      brandId: brand.id,
      warehouseId: warehouse.id,
      barcode: input.barcode,
      description: input.description,
      sellingPrice: input.sellingPrice,
      purchasePrice: input.purchasePrice,
      taxRate: input.taxRate,
      width: input.width,
      height: input.height,
      depth: input.depth,
      dimensionsUnit: input.dimensionsUnit,
      weight: input.weight,
      weightUnit: input.weightUnit,
      warehouse: input.warehouse,
      sku: input.sku,
      quantity: input.quantity,
      unit: input.unit,
      reorderPoint: input.reorderPoint,
      supplier: input.supplier,
      notes: input.notes,
      images: input.images ?? null,
      createdAt: new Date(),
    })

    console.log("✅ Item added to the database")
    return "success"
  } catch (error) {
    console.error("❌ Error adding item:", error)
    return "error"
  }
}

export async function checkItem(input: {
  name: string
  id?: string
}): Promise<boolean> {
  noStore()
  console.log("Checking if item exists:", input.name)

  const existing = await db.query.items.findFirst({
    where: eq(items.name, input.name),
  })

  return !!existing
}
