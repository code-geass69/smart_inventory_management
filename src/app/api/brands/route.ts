import { NextResponse } from "next/server"
import { db } from "@/db"
import { brands, categories } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const categoryName = url.searchParams.get("category")

    if (!categoryName) {
      return NextResponse.json(
        { message: "Category is required" },
        { status: 400 }
      )
    }

    const brandsInCategory = await db
      .select()
      .from(brands)
      .where(eq(brands.category, categoryName))

    if (brandsInCategory.length === 0) {
      return NextResponse.json(
        { message: "No brands found for this category" },
        { status: 404 }
      )
    }

    return NextResponse.json(brandsInCategory)
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json(
      { message: "Failed to fetch brands" },
      { status: 500 }
    )
  }
}
