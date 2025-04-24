import { NextResponse } from "next/server"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))

    if (!customer) {
      return NextResponse.json(
        { status: "error", message: "No customer found with this email." },
        { status: 404 }
      )
    }

    const isValid = await compare(password, customer.password)

    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "Invalid password." },
        { status: 401 }
      )
    }
    return NextResponse.json({
      status: "success",
      message: "Login successful",
      customerId: customer.id,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { status: "error", message: "Something went wrong during login." },
      { status: 500 }
    )
  }
}
