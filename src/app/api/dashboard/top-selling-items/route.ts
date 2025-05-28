import { db } from "@/db";
import { orderItems, items } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const topSellingItemsResult = await db
      .select({
        id: items.id,
        name: items.name,
        total_quantity_sold: sql`SUM(${orderItems.quantity})`.as("total_quantity_sold"),
        total_price: sql`SUM(${orderItems.quantity} * ${orderItems.price})`.as("total_price"),
      })
      .from(orderItems)
      .innerJoin(items, sql`${items.id} = ${orderItems.itemId}`)
      .groupBy(items.id)
      .orderBy(sql`total_quantity_sold DESC`)
      .limit(10)
      .execute();

    return NextResponse.json({
      status: "success",
      data: topSellingItemsResult,
    });
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch top selling items" },
      { status: 500 }
    );
  }
}
