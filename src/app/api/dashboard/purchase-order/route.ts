import { db } from "@/db"; 
import { orderItems } from "@/db/schema"; 
import { sql } from "drizzle-orm/sql"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const purchaseOrderResult = await db
      .select({
        total_quantity_ordered: sql`SUM(${orderItems.quantity})`.as("total_quantity_ordered"),
        total_cost: sql`SUM(${orderItems.quantity} * ${orderItems.price})`.as("total_cost"),
      })
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
