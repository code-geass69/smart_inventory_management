"use server";

import { db } from "@/db";
import { categories, brands, warehouses, items as itemsTable } from "@/db/schema";
import { unstable_noStore as noStore } from "next/cache";
import { extendedItemSchema } from "@/validations/inventory";
import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { InferInsertModel } from "drizzle-orm";

export async function addItem(
  rawInput: z.infer<typeof extendedItemSchema>
): Promise<string> {
  const input = extendedItemSchema.parse(rawInput);


  try {
    if (!input.category || !input.brand || !input.warehouse) {
      throw new Error("Missing category, brand, or warehouse input.");
    }

    const category = await db.query.categories.findFirst({
      where: eq(categories.name, input.category),
    });

    if (!category) {
      throw new Error(`Category "${input.category}" not found.`);
    }

    const brand = await db.query.brands.findFirst({
      where: eq(brands.name, input.brand),
    });

    if (!brand) {
      throw new Error(`Brand "${input.brand}" not found.`);
    }

    const warehouse = await db.query.warehouses.findFirst({
      where: eq(warehouses.name, input.warehouse),
    });

    if (!warehouse) {
      throw new Error(`Warehouse "${input.warehouse}" not found.`);
    }

    const itemToInsert: InferInsertModel<typeof itemsTable> = {
      name: input.name,
      categoryId: category.id,
      brandId: brand.id,
      warehouseId: warehouse.id,
      barcode: input.barcode,
      description: input.description ?? null,
      sellingPrice: String(input.sellingPrice),
      purchasePrice: String(input.purchasePrice),
      taxRate: String(input.taxRate),
      width: String(input.width),
      height: String(input.height),
      depth: String(input.depth),
      dimensionsUnit: input.dimensionsUnit,
      weight: String(input.weight),
      weightUnit: input.weightUnit,
      sku: input.sku,
      quantity: input.quantity,
      unit: input.unit,
      reorderPoint: input.reorderPoint,
      supplier: input.supplier,
      notes: input.notes ?? null,
      createdAt: new Date(),
    };

    await db.insert(itemsTable).values(itemToInsert);
    console.log("Item added to the database");
    return "success";
  } catch (error) {
    console.error("Error adding item:", error);
    return "error";
  }
}

export async function checkItem(input: {
  name: string;
  id?: string;
}): Promise<boolean> {
  noStore();
  console.log("Checking if item exists:", input.name);

  const existing = await db.query.items.findFirst({
    where: eq(itemsTable.name, input.name),
  });

  return !!existing;
}
