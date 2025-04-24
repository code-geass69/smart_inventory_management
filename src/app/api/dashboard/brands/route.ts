import { db } from "@/db"; 
import { brands, items, orderItems, orders } from "@/db/schema"; 
import { sql } from "drizzle-orm"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brandSalesResult = await db
      .select({
        brand_name: brands.name,
        total_quantity_sold: sql`SUM(${orderItems.quantity})`,
      })
      .from(orderItems)
      .innerJoin(items, sql`${items.id} = ${orderItems.itemId}`)
      .innerJoin(brands, sql`${brands.id} = ${items.brandId}`)
      .innerJoin(orders, sql`${orders.id} = ${orderItems.orderId}`)
      .groupBy(brands.name)
      .execute();

    return NextResponse.json({
      status: "success",
      data: brandSalesResult,
    });
  } catch (error) {
    console.error("Error fetching brand sales data:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch brand sales data" },
      { status: 500 }
    );
  }
}
