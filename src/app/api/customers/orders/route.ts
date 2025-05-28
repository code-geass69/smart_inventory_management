import { NextResponse } from "next/server"
import { db } from "@/db"
import { items, orderItems, orders } from "@/db/schema"
import { sql } from "drizzle-orm/sql"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      itemId,
      quantity,
      totalPrice,
      customerId,
      shippingAddress,
      paymentStatus,
    } = body

    const [item] = await db
      .select()
      .from(items)
      .where(sql`${items.id} = ${itemId}`)
      .limit(1)

    if (!item) {
      console.error(`Item with ID ${itemId} not found.`)
      return NextResponse.json(
        { status: "error", message: "Item not found" },
        { status: 404 }
      )
    }

    if (item.quantity < quantity) {
      console.error(
        `Insufficient stock for item ${itemId}. Available: ${item.quantity}, Requested: ${quantity}`
      )
      return NextResponse.json(
        { status: "error", message: "Insufficient stock" },
        { status: 400 }
      )
    }

    const order = await db
      .insert(orders)
      .values({
        customerId,
        totalPrice,
        orderStatus: "pending",
        shippingAddress,
        paymentStatus: "pending",
      })
      .returning()

    if (!order[0]) {
      console.error("Order creation failed: No order returned.")
      return NextResponse.json(
        { status: "error", message: "Order creation failed." },
        { status: 500 }
      )
    }

    await db.insert(orderItems).values({
      orderId: order[0].id,
      itemId,
      quantity,
      price: item.sellingPrice,
    })

    await db
      .update(items)
      .set({
        quantity: item.quantity - quantity,
      })
      .where(sql`${items.id} = ${itemId}`)

    console.log("Order placed successfully")
    return NextResponse.json({
      status: "success",
      message: "Order placed successfully!",
    })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json(
      { status: "error", message: "Order placement failed." },
      { status: 500 }
    )
  }
}
