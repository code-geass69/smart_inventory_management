import { db } from "@/db"
import { customers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Find the customer by email
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

    // Check password
    const isValid = await compare(password, customer.password)

    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "Invalid password." },
        { status: 401 }
      )
    }

    // Return customerId — you can later replace this with JWT/session if needed
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
