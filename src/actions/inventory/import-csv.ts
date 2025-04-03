"use server"
import { db } from "@/db"
import { items, brands, categories, warehouses } from "@/db/schema"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { parse } from "csv-parse/sync"

const CsvItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  brand: z.string(),
  warehouse: z.string(),
  sku: z.string(),
  quantity: z.string(),
  purchasePrice: z.string(),
  sellingPrice: z.string(),
  barcode: z.string(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function importItemsFromCsv(fileBuffer: string): Promise<string> {
  try {
    const records = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
    })
    console.log(`✅ Parsed ${records.length} records from CSV`)
    for (const rawItem of records) {
      const parsed = CsvItemSchema.safeParse(rawItem)

      if (!parsed.success) {
        console.error("❌ Validation error for item:", rawItem)
        console.error(parsed.error)
        throw new Error("Invalid CSV format")
      }
      const input = parsed.data
      // Lookup category
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, input.category))

      if (!category) {
        console.error(`❌ Category not found: ${input.category}`)
        throw new Error(`Missing category for item: ${input.name}`)
      }

      const [brand] = await db
        .select()
        .from(brands)
        .where(eq(brands.name, input.brand))

      if (!brand) {
        console.error(`❌ Brand not found: ${input.brand}`)
        throw new Error(`Missing brand for item: ${input.name}`)
      }

      const [warehouse] = await db
        .select()
        .from(warehouses)
        .where(eq(warehouses.name, input.warehouse.trim())) 


      if (!warehouse) {
        console.error(`❌ Warehouse not found: ${input.warehouse}`)
        throw new Error(`Missing warehouse for item: ${input.name}`)
      }
      await db.insert(items).values({
        name: input.name,
        categoryId: category.id,
        brandId: brand.id,
        warehouseId: warehouse.id,
        sku: input.sku,
        barcode: input.barcode,
        quantity: Number(input.quantity),
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
        description: input.description ?? "",
        notes: input.notes ?? "",
        taxRate: 0,
        width: 0,
        height: 0,
        depth: 0,
        dimensionsUnit: "cm",
        weight: 0,
        weightUnit: "kg",
        unit: "piece",
        reorderPoint: 0,
        supplier: "unknown",
        createdAt: new Date(),
      })
      console.log(`✅ Item "${input.name}" successfully inserted`)
    }
    return "success"
  } catch (error) {
    console.error("❌ Error importing items:", error)
    return "error"
  }
}
