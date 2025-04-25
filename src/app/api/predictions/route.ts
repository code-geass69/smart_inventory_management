import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { items, orderItems, orders } from "@/db/schema"
import { sql } from "drizzle-orm"

const simpleLinearRegression = (x: number[], y: number[]): number[] => {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, xi, i) => acc + xi * (y[i] || 0), 0)
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0)

  const denominator = n * sumX2 - sumX * sumX
  const m = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0
  const b = n !== 0 ? (sumY - m * sumX) / n : 0

  const futureMonths = [7, 8, 9, 10]
  return futureMonths.map((month) => m * month + b)
}

export async function GET(req: NextRequest) {
  try {
    const salesData = await db.execute(
      sql`
        SELECT 
          EXTRACT(MONTH FROM ${orders.createdAt}) AS month,
          SUM(${orderItems.quantity}) AS total_units
        FROM ${orderItems}
        LEFT JOIN ${orders} ON ${orders.id} = ${orderItems.orderId}
        GROUP BY month
        ORDER BY month ASC
      `
    )

    const months: number[] = []
    const units: number[] = []

    salesData.rows.forEach((row) => {
      months.push(Number(row.month))
      units.push(Number(row.total_units))
    })

    const salesForecast = simpleLinearRegression(months, units)

    const demandPrediction = await db.execute(
      sql`
        SELECT ${items.name} AS name, SUM(${orderItems.quantity}) AS predictedDemand
        FROM ${orderItems}
        LEFT JOIN ${items} ON ${items.id} = ${orderItems.itemId}
        GROUP BY ${items.name}
        ORDER BY predictedDemand DESC
        LIMIT 5
      `
    )

    const revenueResult = await db.execute(
      sql`
        SELECT SUM(${orderItems.price} * ${orderItems.quantity}) AS totalRevenue
        FROM ${orderItems}
      `
    )
    const revenuePrediction = Number(revenueResult.rows[0]?.totalRevenue || 0)

    const shortageResult = await db.execute(
      sql`
        SELECT COUNT(*) > 0 AS hasShortage
        FROM ${items}
        WHERE ${items.quantity} < ${items.reorderPoint}
      `
    )
    const inventoryShortage = shortageResult.rows[0]?.hasshortage

    return NextResponse.json({
      salesForecast,
      churnRate: 8,
      itemDemandPrediction: demandPrediction.rows,
      revenuePrediction,
      inventoryShortage,
    })
  } catch (error) {
    console.error("🔴 Prediction API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
