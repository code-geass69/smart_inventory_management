import { db } from "@/db"
import { customers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const result = await db
    .select({ name: customers.name })
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1)

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ name: result[0].name })
}
