import { db } from "@/db"; // Import your database connection
import { orderItems } from "@/db/schema"; // Import your schema
import { sql } from "drizzle-orm"; // For raw SQL queries
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Query to get total quantity and cost
    const purchaseOrderResult = await db
      .select([
        sql`SUM(${orderItems.quantity}) AS total_quantity_ordered`,
        sql`SUM(${orderItems.quantity} * ${orderItems.price}) AS total_cost`
      ])
      .from(orderItems)
      .execute();

    return NextResponse.json({
      status: "success",
      data: purchaseOrderResult,
    });
  } catch (error) {
    console.error("Error fetching purchase order data:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch purchase order data" },
      { status: 500 }
    );
  }
}
