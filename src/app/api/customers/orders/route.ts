import { db } from "@/db"
import { orders, orderItems, items } from "@/db/schema"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm" // Make sure to import the SQL method

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Request body:", body)

    const { itemId, quantity, totalPrice, customerId, shippingAddress } = body

    // Fetch the item details from the database using raw SQL
    const [item] = await db
      .select()
      .from(items)
      .where(sql`${items.id} = ${itemId}`)  // Raw SQL condition
      .limit(1)

    console.log("Fetched item:", item)

    if (!item) {
      console.error(`Item with ID ${itemId} not found.`)
      return NextResponse.json({ status: "error", message: "Item not found" }, { status: 404 })
    }

    if (item.quantity < quantity) {
      console.error(`Insufficient stock for item ${itemId}. Available: ${item.quantity}, Requested: ${quantity}`)
      return NextResponse.json({ status: "error", message: "Insufficient stock" }, { status: 400 })
    }

    // Insert the order into the orders table
    const order = await db.insert(orders).values({
      customerId,
      totalPrice,
      orderStatus: "pending",
      shippingAddress,
      paymentStatus: "pending",
    }).returning()

    console.log("Order inserted successfully:", order)

    // Insert the order item into the order_items table
    await db.insert(orderItems).values({
      orderId: order[0].id, // Use the correct order ID returned from the insert
      itemId,
      quantity,
      price: item.sellingPrice,
    })

    // Update the quantity of the item in the items table
    await db.update(items).set({
      quantity: item.quantity - quantity,
    }).where(sql`${items.id} = ${itemId}`)

    console.log("Order placed successfully")
    return NextResponse.json({ status: "success", message: "Order placed successfully!" })
  } catch (error) {
    console.error("Error placing order:", error)
    return NextResponse.json({ status: "error", message: "Order placement failed." }, { status: 500 })
  }
}
