import { db } from "@/db"; 
import { orders, items, orderItems } from "@/db/schema"; 
import { sql } from "drizzle-orm/sql"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const quantityInHandResult = await db
      .select()
      .from(items)
      .execute();
     
    const quantityInHand = quantityInHandResult.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    const quantityToBeSentResult = await db
      .select()
      .from(orderItems) 
      .innerJoin(orders, sql`${orders.id} = ${orderItems.orderId}`) 
      .where(sql`${orders.orderStatus} = 'pending'`) 
      .execute();

    const quantityToBeSent = quantityToBeSentResult.reduce(
      (sum: number, orderItem: any) => {
        return sum + (orderItem.order_items ? orderItem.order_items.quantity : 0);
      },
      0
    );

    return NextResponse.json({
      status: "success",
      data: {
        quantityInHand,
        quantityToBeSent,
      },
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch inventory summary" },
      { status: 500 }
    );
  }
}
