export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, items, orderItems, orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Missing email" },
        { status: 400 }
      );
    }

    const [customer] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(sql`${customers.email} = ${email}`);

    if (!customer) {
      return NextResponse.json(
        { status: "error", message: "Customer not found" },
        { status: 404 }
      );
    }

    const orderData = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customer.id))
      .orderBy(sql`${orders.createdAt} DESC`);

    const ordersWithItems = await Promise.all(
      orderData.map(async (order) => {
        const joinedItems = await db
          .select({
            itemId: orderItems.itemId,
            quantity: orderItems.quantity,
            price: orderItems.price,
            itemName: items.name,
            description: items.description,
          })
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))
          .innerJoin(items, eq(orderItems.itemId, items.id));

        return {
          ...order,
          items: joinedItems,
        };
      })
    );

    return NextResponse.json({ status: "success", data: ordersWithItems });
  } catch (error) {
    console.error("Error fetching invoice data:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}