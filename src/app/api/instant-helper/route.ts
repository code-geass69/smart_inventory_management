import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { brands, categories as Category, items as Item } from "@/db/schema"
import { writeToBuffer } from "@fast-csv/format"
import { eq, lt, sql } from "drizzle-orm"

type KeywordReply = () => Promise<{
  replies: string | string[]
  chartData?: {
    categoryChart: { Category: string | null; count: unknown }[]
    brandChart: { Brand: string | null; count: unknown }[]
    itemChart: { Item: string; quantity: number }[]
  }
  summaryText?: string
  csvPreview?: {
    base64: string
    fileName: string
  }
}>

const dynamicOptionHandlers: Record<string, KeywordReply> = {
  "check stock analytics": async () => {
    const ItemByCategory = await db
      .select({ Category: Category.name, count: sql`COUNT(*)`.as("count") })
      .from(Item)
      .leftJoin(Category, eq(Item.categoryId, Category.id))
      .groupBy(Category.name)

    const ItemByBrand = await db
      .select({ Brand: brands.name, count: sql`COUNT(*)`.as("count") })
      .from(Item)
      .leftJoin(brands, eq(Item.brandId, brands.id))
      .groupBy(brands.name)

    const TopItems = await db
      .select({ Item: Item.name, quantity: Item.quantity })
      .from(Item)
      .orderBy(sql`${Item.quantity} DESC`)
      .limit(5)

    const summary = [
      `📊 Category-wise: ${ItemByCategory.length} categories`,
      `🏷️ Brand-wise: ${ItemByBrand.length} brands`,
      `📦 Item-wise: Showing top ${TopItems.length} items by quantity`,
    ]

    return {
      replies: summary,
      chartData: {
        categoryChart: ItemByCategory,
        brandChart: ItemByBrand,
        itemChart: TopItems,
      },
      summaryText: summary.map((line) => `• ${line}`).join("\n"),
    }
  },

  "import items via csv": async () => {
    const itemRows = await db
      .select({
        name: Item.name,
        quantity: Item.quantity,
        reorderPoint: Item.reorderPoint,
        category: Category.name,
        brand: brands.name,
      })
      .from(Item)
      .leftJoin(Category, eq(Item.categoryId, Category.id))
      .leftJoin(brands, eq(Item.brandId, brands.id))

    const headers = ["name", "quantity", "reorderPoint", "category", "brand"]
    const rows = [
      headers,
      ...itemRows.map((row) => [
        row.name,
        row.quantity.toString(),
        row.reorderPoint.toString(),
        row.category || "",
        row.brand || "",
      ]),
    ]

    const csvBuffer = await writeToBuffer(itemRows, { headers: true })
    const csvBase64 = csvBuffer.toString("base64")

    return {
      replies: "🧾preview of items in CSV.",
      csvPreview: {
        base64: csvBase64,
        fileName: "inventory-items.csv",
        rows,
      },
    }
  },
}

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  const lower = message.toLowerCase()

  const matchedKey = Object.keys(dynamicOptionHandlers).find((key) =>
    lower.includes(key)
  )

  if (!matchedKey) {
    return NextResponse.json({
      replies: `🤔 I don't recognize "${message}". Try a valid option like "Check stock analytics".`,
    })
  }

  if (matchedKey in dynamicOptionHandlers) {
    const handler =
      dynamicOptionHandlers[matchedKey as keyof typeof dynamicOptionHandlers]
    if (!handler) {
      return NextResponse.json({
        replies: ["⚠️ Something went wrong. Please try again."],
      })
    }
    const result = await handler()

    if (result.csvPreview) {
      return NextResponse.json({
        ...result,
        downloadUrl: `/api/instant-helper?file=${encodeURIComponent(result.csvPreview.base64)}&name=${encodeURIComponent(result.csvPreview.fileName)}`,
      })
    }

    return NextResponse.json(result)
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const base64 = searchParams.get("file")
  const fileName = searchParams.get("name") || "inventory-preview.csv"

  if (!base64) {
    return new NextResponse("Missing file content", { status: 400 })
  }

  try {
    const buffer = Buffer.from(base64, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    return new NextResponse("Failed to decode file", { status: 500 })
  }
}
