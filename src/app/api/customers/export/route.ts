import { NextResponse } from "next/server"
import { db } from "@/db"
import { customers } from "@/db/schema"
import { Parser } from "json2csv"

export async function GET() {
  try {
    const allCustomers = await db.select().from(customers)

    const formattedCustomers = allCustomers.map((c) => ({
      name: c.name,
      email: c.email,
      phone_number: c.phone_number,
      address: c.address,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    const json2csvParser = new Parser()
    const csvData = json2csvParser.parse(formattedCustomers)

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.-]/g, "")
      .slice(0, 19)
      .replace("T", "_")
    const filename = `customers_${timestamp}.csv`

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    })
  } catch (error) {
    console.error("❌ Error exporting customers:", error)
    return NextResponse.json(
      { status: "error", message: "Failed to export customers" },
      { status: 500 }
    )
  }
}
