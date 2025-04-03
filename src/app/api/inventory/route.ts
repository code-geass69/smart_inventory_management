// src/app/api/inventory/route.ts

import { db } from "@/db" // Adjust the path based on your db setup
import { items, categories } from "@/db/schema" // Import the necessary schemas
import { sql } from "drizzle-orm"
import { NextResponse } from "next/server" // Import NextResponse

// Exporting the handler for the GET method
export async function GET() {
  try {
    // Fetch the count of items per category
    const result = await db
      .select({
        categoryName: categories.name,
        itemCount: sql<number>`count(${items.id})`, // Count the items per category
      })
      .from(items)
      .innerJoin(categories, sql`${categories.id} = ${items.categoryId}`) // SQL equality comparison
      .groupBy(categories.name)

    return NextResponse.json(result) // Return the result as JSON using NextResponse
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category data" }, { status: 500 }) // Return error response
  }
}
