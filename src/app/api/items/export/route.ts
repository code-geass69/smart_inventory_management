export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { items } from "@/db/schema";
import { Parser } from "json2csv";

export async function GET() {
  try {
    const allItems = await db.select().from(items);

    console.log(`Fetched ${allItems.length} items from the database.`);
    console.log("Preparing the data to be formatted for CSV...");

    const formattedItems = allItems.map((item) => ({
      name: item.name,
      categoryId: item.categoryId,
      brandId: item.brandId,
      warehouseId: item.warehouseId,
      barcode: item.barcode,
      description: item.description,
      sellingPrice: item.sellingPrice,
      purchasePrice: item.purchasePrice,
      taxRate: item.taxRate,
      width: item.width,
      height: item.height,
      depth: item.depth,
      dimensionsUnit: item.dimensionsUnit,
      weight: item.weight,
      weightUnit: item.weightUnit,
      sku: item.sku,
      quantity: item.quantity,
      unit: item.unit,
      reorderPoint: item.reorderPoint,
      supplier: item.supplier,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    if (!formattedItems || formattedItems.length === 0) {
      console.warn("⚠️ No items to export.");
      return NextResponse.json(
        { message: "No data to export" },
        { status: 400 }
      );
    }

    console.log("🔍 Converting data to CSV format...");
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(formattedItems);

    console.log("✅ Data successfully converted to CSV.");

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "").slice(0, 19).replace("T", "_");
    const filename = `inventory_${timestamp}.csv`;

    console.log("📤 Sending CSV file as response...");

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    return NextResponse.json(
      { message: "Failed to export data" },
      { status: 500 }
    );
  }
}