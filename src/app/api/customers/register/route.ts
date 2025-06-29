import { NextResponse } from "next/server"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { hash } from "bcryptjs"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, address, password, state } = body

    const existingEmail = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { status: "error", message: "Email already registered" },
        { status: 409 }
      )
    }

    const existingPhone = await db
      .select()
      .from(customers)
      .where(eq(customers.phone_number, phone))
    if (existingPhone.length > 0) {
      return NextResponse.json(
        { status: "error", message: "Phone number already registered" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)

    await db.insert(customers).values({
      name,
      email,
      phone_number: phone,
      address,
      password: hashedPassword,
      state,
    })

    return NextResponse.json({
      status: "success",
      message: "Customer registered successfully",
    })
  } catch (error: any) {
    console.error("Registration Error:", error)

    if (error.code === "23505") {
      if (error.detail?.includes("(phone_number)")) {
        return NextResponse.json(
          { status: "error", message: "Phone number already registered" },
          { status: 409 }
        )
      }
      if (error.detail?.includes("(email)")) {
        return NextResponse.json(
          { status: "error", message: "Email already registered" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { status: "error", message: "Registration failed" },
      { status: 500 }
    )
  }
}
