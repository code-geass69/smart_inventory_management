import { db } from "@/db"
import { orders, orderItems, items } from "@/db/schema"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm" // Ensure SQL method is imported

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { itemId, quantity, totalPrice, customerId, shippingAddress, paymentStatus } = body

    const [item] = await db
      .select()
      .from(items)
      .where(sql`${items.id} = ${itemId}`)  // Raw SQL condition
      .limit(1)

    console.log("Fetched item:", item)

    if (!item) {
      return NextResponse.json({ status: "error", message: "Item not found" }, { status: 404 })
    }

    if (item.quantity < quantity) {
      return NextResponse.json({ status: "error", message: "Insufficient stock" }, { status: 400 })
    }

    const [order] = await db.insert(orders).values({
      customerId,
      totalPrice,
      orderStatus: "pending", 
      shippingAddress,
      paymentStatus, 
    }).returning(); 

    if (!order) {
      return NextResponse.json({ status: "error", message: "Order creation failed" }, { status: 500 })
    }

    await db.insert(orderItems).values({
      orderId: order.id, 
      itemId,
      quantity,
      price: item.sellingPrice,
    })

    // Update the stock of the item in the inventory
    await db.update(items).set({
      quantity: item.quantity - quantity,
    }).where(sql`${items.id} = ${itemId}`)

    return NextResponse.json({ status: "success", message: "Order placed successfully!" })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json({ status: "error", message: "Order placement failed." }, { status: 500 })
  }
}
