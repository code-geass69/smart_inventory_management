import { NextResponse } from "next/server"
import { db } from "@/db"
import { items, categories, brands, warehouses } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Parser } from "json2csv"

export async function GET() {
  try {
    console.log("📥 Starting export...")

    // Fetch all inventory data from the database
    console.log("🔍 Fetching all items from the database...")
    const allItems = await db
      .select()
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .innerJoin(brands, eq(items.brandId, brands.id))
      .innerJoin(warehouses, eq(items.warehouseId, warehouses.id))

    console.log(`✅ Fetched ${allItems.length} items from the database.`)

    // Prepare the data to be converted to CSV format
    console.log("🔍 Preparing the data to be formatted for CSV...")
    const formattedItems = allItems.map(item => ({
      name: items.name,
      category: item.category.name,  // Access category name
      brand: item.brands.name,  // Access brand name
      warehouse: item.warehouse.name,  // Access warehouse name
      sku: items.sku,
      quantity: items.quantity,
      purchasePrice: items.purchasePrice,
      sellingPrice: items.sellingPrice,
      description: items.description,
      notes: items.notes,
    }))

    console.log("✅ Data successfully prepared for CSV format.")

    // Convert the inventory data to CSV format
    console.log("🔍 Converting data to CSV format...")
    const json2csvParser = new Parser()
    const csvData = json2csvParser.parse(formattedItems)

    console.log("✅ Data successfully converted to CSV.")

    // Send CSV file as response
    console.log("📤 Sending CSV file as response...")
    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=inventory.csv",
      },
    })
  } catch (error) {
    console.error("❌ Error exporting data:", error)
    return NextResponse.json({ status: "error" })
  }
}
