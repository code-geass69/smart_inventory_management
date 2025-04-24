import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import {
  brands,
  categories as Category,
  items as Item,
  orderItems as OrderItem,
} from "@/db/schema"
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

  "export items via csv": async () => {
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

    const csvBuffer = await writeToBuffer(rows)
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

  "generate inventory sales": async () => {
    const orderStats = await db
      .select({
        itemId: sql`${Item.id}`,
        itemName: Item.name,
        quantity: sql`SUM(${OrderItem.quantity})`.as("count"),
        timesOrdered: sql`COUNT(${OrderItem.id})`.as("times_ordered"),
      })
      .from(OrderItem)
      .leftJoin(Item, eq(OrderItem.itemId, Item.id))
      .groupBy(Item.id, Item.name)

    const quantityChart = orderStats.map((row) => ({
      Item: row.itemName as string,
      quantity: Number(row.quantity),
    }))

    const orderFrequencyChart = orderStats.map((row) => ({
      Item: row.itemName as string,
      timesOrdered: Number(row.timesOrdered),
    }))

    return {
      replies: "📈 Inventory statistics generated.",
      chartData: {
        categoryChart: [],
        brandChart: [],
        itemChart: quantityChart,
      },
      summaryText: `• Total items with sales: ${quantityChart.length}\n• Highest sold: ${
        quantityChart.length > 0
          ? quantityChart.sort((a, b) => b.quantity - a.quantity)[0]?.Item ||
            "N/A"
          : "N/A"
      }`,
      additionalStats: {
        frequency: orderFrequencyChart,
      },
    }
  },

  "download summary report": async () => {
    const orderStats = await db
      .select({
        itemId: Item.id,
        itemName: Item.name,
        quantity: sql`COALESCE(SUM(${OrderItem.quantity}), 0)`.as("quantity"),
        timesOrdered: sql`COUNT(${OrderItem.id})`.as("timesOrdered"),
      })
      .from(Item)
      .leftJoin(OrderItem, eq(Item.id, OrderItem.itemId))
      .groupBy(Item.id)

    const sold = orderStats.filter((item) => Number(item.quantity) > 0)
    const unsold = orderStats.filter((item) => Number(item.quantity) === 0)

    const summaryLines = [
      [`Total sold items`, `${sold.length}`],
      [
        `Best-selling item`,
        `${sold.sort((a, b) => Number(b.quantity) - Number(a.quantity))[0]?.itemName || "N/A"}`,
      ],
      [
        `Least-selling item`,
        `${sold.sort((a, b) => Number(a.quantity) - Number(b.quantity))[0]?.itemName || "N/A"}`,
      ],
      [
        `Unsold items (${unsold.length})`,
        unsold.map((i) => i.itemName).join(", ") || "None",
      ],
      [
        `Suggestion`,
        `Consider reviewing unsold products or bundling them with best-sellers.`,
      ],
      [`Suggestion`, `Reorder top-selling items soon to avoid stockouts.`],
      [
        `Suggestion`,
        `Investigate reasons for low-performing products and optimize listings.`,
      ],
    ]

    const csvBuffer = await writeToBuffer(summaryLines, {
      headers: ["Metric", "Details"],
    })
    const csvBase64 = csvBuffer.toString("base64")

    return {
      replies: "🧾 Summary report generated.",
      csvPreview: {
        base64: csvBase64,
        fileName: "inventory-summary.csv",
        rows: [["Metric", "Details"], ...summaryLines],
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
