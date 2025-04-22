import { db } from "@/db"; // Ensure the database connection is correctly imported
import { orders } from "@/db/schema"; // Import the orders schema
import { sql } from "drizzle-orm"; // Import SQL for raw queries
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingCountResult = await db
      .select()
      .from(orders)
      .where(sql`${orders.orderStatus} = 'pending'`)
      .execute(); // Execute raw SQL query
    const pendingCount = pendingCountResult.length;

    const shippedCountResult = await db
      .select()
      .from(orders)
      .where(sql`${orders.orderStatus} = 'shipped'`)
      .execute();
    const shippedCount = shippedCountResult.length;

    const deliveredCountResult = await db
      .select()
      .from(orders)
      .where(sql`${orders.orderStatus} = 'delivered'`)
      .execute();
    const deliveredCount = deliveredCountResult.length;

    const acceptedCountResult = await db
      .select()
      .from(orders)
      .where(sql`${orders.orderStatus} = 'accepted'`)
      .execute();
    const acceptedCount = acceptedCountResult.length;

    // Return the counts in the response
    return NextResponse.json({
      status: "success",
      data: {
        toBePacked: pendingCount,
        toBeShipped: shippedCount,
        toBeDelivered: deliveredCount,
        toBeInvoiced: acceptedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching sales activity:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch sales activity" },
      { status: 500 }
    );
  }
}
