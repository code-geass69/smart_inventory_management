import { NextRequest, NextResponse } from "next/server"

const keywordResponses: Record<string, string[]> = {
  csv: [
    "📥 Import items via CSV",
    "📤 Export inventory as CSV",
    "💡 Make sure columns match your item schema!",
  ],
  stock: [
    "📦 View low stock alerts",
    "🛎️ Set reorder points",
    "📊 Check stock analytics",
  ],
  report: [
    "📈 Generate inventory statistics",
    "📄 Download summary report",
  ],
  reorder: [
    "🔁 Update reorder thresholds",
    "📬 Schedule stock refresh notifications",
  ],
  analytics: [
    "📊 View dashboard insights",
    "📈 Compare purchase vs selling trends",
  ],
}

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  console.log("📩 Incoming Instant Helper message:", message)

  const lower = message.toLowerCase()
  const matchedKey = Object.keys(keywordResponses).find((key) =>
    lower.includes(key)
  )

  if (!matchedKey) {
    return NextResponse.json({
      replies: [`🤔 I'm not sure how to help with "${message}". Try a keyword like "csv" or "stock".`],
    })
  }

  return NextResponse.json({
    replies: keywordResponses[matchedKey],
  })
}
