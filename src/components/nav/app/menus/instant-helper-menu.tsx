"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CustomTooltip } from "@/components/custom-tooltip"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const keywords = ["CSV", "Stock", "Report", "Reorder", "Analytics"]

export function InstantHelperMenu(): JSX.Element {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    setMessages((prev) => [...prev, { from: "user", text }])
    setLoading(true)

    try {
      const res = await fetch("/api/instant-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })

      const data = await res.json()

      if (data?.replies?.length) {
        data.replies.forEach((reply: string) => {
          setMessages((prev) => [...prev, { from: "bot", text: reply }])
        })
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "❌ I didn't quite get that. Try using a keyword like 'CSV' or 'Report'." },
        ])
      }
    } catch (error) {
      console.error("❌ Error fetching response:", error)
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Something went wrong. Please try again." },
      ])
    }

    setLoading(false)
  }

  return (
    <Sheet>
      <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-600 hover:bg-orange-600/80">
        <CustomTooltip text="Instant Helper">
          <Icons.helpBadge className="h-5 w-5 text-foreground" />
        </CustomTooltip>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col h-full w-[400px] z-[99] p-4">
        <SheetHeader className="mb-2">
          <SheetTitle>🤖 Instant Helper</SheetTitle>
        </SheetHeader>

        {/* Keyword Suggestion Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {keywords.map((kw) => (
            <Button
              key={kw}
              variant="outline"
              size="sm"
              onClick={() => sendMessage(kw)}
            >
              {kw}
            </Button>
          ))}
        </div>

        {/* Chat log */}
        <div className="flex-1 overflow-y-auto space-y-3 px-1 py-2 bg-muted rounded-md">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-sm ${msg.from === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.from === "user"
                    ? "bg-orange-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-left">
              <div className="inline-block px-3 py-2 rounded-lg bg-white text-black animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
            setInput("")
          }}
          className="flex items-center gap-2 mt-4"
        >
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            disabled={loading}
          >
            Send
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
