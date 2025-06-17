import { NextResponse } from "next/server"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { sql } from "drizzle-orm/sql"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const customerId = searchParams.get("customerId")

    if (!customerId) {
      return NextResponse.json(
        { status: "error", message: "Missing customerId" },
        { status: 400 }
      )
    }

    const [customer] = await db
      .select()
      .from(customers)
      .where(sql`${customers.id} = ${Number(customerId)}`)
      .limit(1)

    if (!customer) {
      return NextResponse.json(
        { status: "error", message: "Customer not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      status: "success",
      data: {
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phone_number,
        address: customer.address,
        state: customer.state,
        createdAt: customer.createdAt,
      },
    })
  } catch (error) {
    console.error("Error fetching customer profile:", error)
    return NextResponse.json(
      { status: "error", message: "Failed to fetch customer profile." },
      { status: 500 }
    )
  }
}
