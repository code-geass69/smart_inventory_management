"use client"

import { useEffect, useRef, useState } from "react"
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import styles from "@/styles/helperScroll.module.css"

const keywordOptions: Record<string, string[]> = {
  CSV: ["📅 Export Items via CSV"],
  Stock: ["📊 Check stock analytics"],
  Report: ["📈 Generate inventory sales", "📄 Download summary report"],
  Analytics: ["📊 View dashboard insights", "📈 Compare purchase vs sell trends"],
}

interface ChartData {
  categoryChart: { Category: string; count: number }[]
  brandChart: { Brand: string; count: number }[]
  itemChart: { Item: string; count: number }[]
}

export function InstantHelperMenu(): JSX.Element {
  const [messages, setMessages] = useState<{
    from: string
    text: string | string[]
    type?: string
    csvUrl?: string
    csvData?: string[][]
  }[]>([
    { from: "bot", text: getGreeting() + " 👋 How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData>({ categoryChart: [], brandChart: [], itemChart: [] })
  const [chartInsights, setChartInsights] = useState<string>("")
  const [orderFrequencyChart, setOrderFrequencyChart] = useState<{ Item: string; timesOrdered: number }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "🌅 Good morning!"
    if (hour < 18) return "☀️ Good afternoon!"
    return "🌙 Good evening!"
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { from: "user", text }])
    setInput("")
    setLoading(true)
    scrollToBottom()

    try {
      const res = await fetch("/api/instant-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()

      if (data?.replies?.length) {
        const filtered = Array.isArray(data.replies)
          ? data.replies.filter((line: string) => !line.includes("Category-wise") && !line.includes("Brand-wise") && !line.includes("Item-wise"))
          : [data.replies]

        setMessages((prev) => [...prev, { from: "bot", text: filtered }])

        if (text.toLowerCase().includes("export items via csv") && data.csvPreview) {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "",
              type: "csv-preview",
              csvUrl: data.downloadUrl,
              csvData: data.csvPreview.rows,
            },
          ])
        }

        if (text.toLowerCase().includes("download summary report") && data.csvPreview) {
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "",
              type: "summary-preview",
              csvUrl: data.downloadUrl,
              csvData: data.csvPreview.rows,
            },
          ])
        }
        
        if (text.toLowerCase().includes("generate inventory sales") && data.chartData) {
          setChartData(data.chartData)
          setChartInsights(data.summaryText)
          setOrderFrequencyChart(data.additionalStats?.frequency || [])
          setMessages((prev) => [...prev, { from: "bot", text: "", type: "report-preview" }])
        }
        
        if (text.toLowerCase().includes("check stock analytics") && data.chartData) {
          setChartData(data.chartData)
          setChartInsights(data.summaryText)
          setMessages((prev) => [...prev, { from: "bot", text: "", type: "chart-preview" }])
        }

        scrollToBottom()
      } else {
        setMessages((prev) => [...prev, {
          from: "bot",
          text: `🚐 I don't recognize "${text}". Try a valid option like "Check stock analytics".`,
        }])
        setTimeout(() => scrollToBottom(), 500)
      }
    } catch (error) {
      console.error("❌ Error fetching response:", error)
      setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Something went wrong. Please try again." }])
      scrollToBottom()
    }

    setLoading(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Sheet>
      <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-600 hover:bg-orange-600/80">
        <CustomTooltip text="Instant Helper">
          <Icons.helpBadge className="h-5 w-5 text-foreground" />
        </CustomTooltip>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col h-full w-[400px] z-[99] p-4 overflow-x-hidden">
        <SheetHeader className="mb-2">
          <SheetTitle>🤖 Instant Helper</SheetTitle>
        </SheetHeader>

        <div className="mb-2 text-sm font-semibold">📌 Keywords</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(keywordOptions).map((kw) => (
            <Button key={kw} variant="outline" size="sm" onClick={() => {
              const options = keywordOptions[kw] ?? []
              setMessages((prev) => [...prev, { from: "user", text: kw }])
              setLoading(true)
              scrollToBottom()
              setTimeout(() => {
                setMessages((prev) => [...prev, { from: "bot", text: options }])
                setLoading(false)
                scrollToBottom()
              }, 500)
            }}>{kw}</Button>
          ))}
        </div>

        <div className={`flex-1 overflow-y-auto overflow-x-hidden space-y-3 px-1 py-2 bg-muted rounded-md ${styles.scrollArea}`}>
          {messages.map((msg, idx) => {
            if (msg.type === "chart-preview") {
              return (
                <div key={idx} className="w-full">
                  <Dialog>
                    <div className="relative rounded bg-black/40 shadow-inner backdrop-blur-sm p-2">
                      <div className="pointer-events-none opacity-60 blur-sm select-none space-y-2">
                        <ResponsiveContainer width="100%" height={60}><BarChart data={chartData.categoryChart}><Bar dataKey="count" fill="#ea580c" /></BarChart></ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={60}><BarChart data={chartData.brandChart}><Bar dataKey="count" fill="#ea580c" /></BarChart></ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={60}><BarChart data={chartData.itemChart}><Bar dataKey="count" fill="#ea580c" /></BarChart></ResponsiveContainer>
                      </div>
                      <DialogTrigger asChild>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="text-white text-sm font-medium bg-transparent hover:text-orange-400 cursor-pointer">
                            👁️ Preview Analytics
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-neutral-900 p-4 max-w-[90vw] md:max-w-[500px] text-white">
                        <h4 className="text-white font-bold mb-2">📊 Inventory Analytics</h4>
                        <div className="mb-3 space-y-1">
                          {chartInsights.split("•").filter((line) => line.trim()).map((line, i) => (
                            <div key={i} className="text-sm text-black bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
                              <span>{line.trim()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-5">
                          <div><h5 className="font-semibold mb-1">Category-wise</h5><ResponsiveContainer width="100%" height={150}><BarChart data={chartData.categoryChart}><XAxis dataKey="Category" stroke="#888" /><YAxis stroke="#888" /><Tooltip /><Bar dataKey="count" fill="#ea580c" /></BarChart></ResponsiveContainer></div>
                          <div><h5 className="font-semibold mb-1">Brand-wise</h5><ResponsiveContainer width="100%" height={150}><BarChart data={chartData.brandChart}><XAxis dataKey="Brand" stroke="#888" /><YAxis stroke="#888" /><Tooltip /><Bar dataKey="count" fill="#ea580c" /></BarChart></ResponsiveContainer></div>
                        </div>
                      </DialogContent>
                    </div>
                  </Dialog>
                </div>
              )
            }

            if (msg.type === "csv-preview") {
              return (
                <div key={idx} className="w-full">
                  <Dialog>
                    <div className="relative rounded bg-black/30 shadow-inner backdrop-blur-sm p-2">
                      <div className="text-center text-sm text-white opacity-50 blur-sm select-none">📄 CSV Preview (Blurred)</div>
                      <DialogTrigger asChild>
                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
                          <div className="text-white text-sm font-medium bg-transparent hover:text-orange-400">
                            👁️ Preview CSV
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-black p-4 max-w-[90vw] md:max-w-[600px]">
                        <h4 className="text-xl font-bold mb-2">📋 CSV Preview</h4>
                        <div className="overflow-x-auto max-h-[300px] border rounded">
                          <table className="min-w-full text-sm table-fixed">
                            <thead>
                              <tr>
                                {msg.csvData?.[0]?.map((col, i) => (
                                  <th key={i} className="px-2 py-1 bg-gray-100 border">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {msg.csvData?.slice(1).map((row, i) => (
                                <tr key={i}>
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-2 py-1 border">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <a
                          href={msg.csvUrl}
                          download="inventory-preview.csv"
                          className="mt-4 inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                        >
                          ⬇️ Download CSV
                        </a>
                      </DialogContent>
                    </div>
                  </Dialog>
                </div>
              )
            }

            if (msg.type === "report-preview") {
              return (
                <div key={idx} className="w-full">
                  <Dialog>
                    <div className="relative rounded bg-black/40 shadow-inner backdrop-blur-sm p-2">
                      <div className="pointer-events-none opacity-60 blur-sm select-none space-y-2">
                        <ResponsiveContainer width="100%" height={60}>
                          <BarChart data={chartData.itemChart}>
                            <Bar dataKey="quantity" fill="#ea580c" />
                          </BarChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={60}>
                          <BarChart data={orderFrequencyChart}>
                            <Bar dataKey="timesOrdered" fill="#ea580c" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <DialogTrigger asChild>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="text-white text-sm font-medium bg-transparent hover:text-orange-400 cursor-pointer">
                            👁️ Preview Sales Report
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-neutral-900 p-4 max-w-[90vw] md:max-w-[500px] text-white">
                        <h4 className="text-white font-bold mb-2">📊 Inventory Sales Report</h4>
                        <div className="mb-3 space-y-1">
                          {chartInsights.split("•").filter((line) => line.trim()).map((line, i) => (
                            <div key={i} className="text-sm text-black bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
                              <span>{line.trim()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-5">
                          <div>
                            <h5 className="font-semibold mb-1">Item-wise Sales Quantity</h5>
                            <ResponsiveContainer width="100%" height={150}>
                              <BarChart data={chartData.itemChart}>
                                <XAxis dataKey="Item" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Bar dataKey="quantity" fill="#ea580c" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div>
                            <h5 className="font-semibold mb-1">Item-wise Order Frequency</h5>
                            <ResponsiveContainer width="100%" height={150}>
                              <BarChart data={orderFrequencyChart}>
                                <XAxis dataKey="Item" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Bar dataKey="timesOrdered" fill="#ea580c" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </DialogContent>
                    </div>
                  </Dialog>
                </div>
              )
            }

            if (msg.type === "summary-preview") {
              return (
                <div key={idx} className="w-full">
                  <Dialog>
                    <div className="relative rounded bg-black/30 shadow-inner backdrop-blur-sm p-2">
                      <div className="text-center text-sm text-white opacity-50 blur-sm select-none">📋 Summary Report (Blurred)</div>
                      <DialogTrigger asChild>
                        <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
                          <div className="text-white text-sm font-medium bg-transparent hover:text-orange-400">
                            👁️ Preview Summary
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-black p-4 max-w-[90vw] md:max-w-[600px]">
                        <h4 className="text-xl font-bold mb-2">📋 Inventory Summary Report</h4>
                        <div className="overflow-x-auto max-h-[300px] border rounded">
                          <table className="min-w-full text-sm table-fixed">
                            <thead>
                              <tr>{msg.csvData?.[0]?.map((col, i) => <th key={i} className="px-2 py-1 bg-gray-100 border">{col}</th>) ?? null}</tr>
                            </thead>
                            <tbody>
                              {msg.csvData?.slice(1).map((row, i) => (
                                <tr key={i}>{row.map((cell, j) => (
                                  <td key={j} className="px-2 py-1 border">{cell}</td>
                                ))}</tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <a
                          href={msg.csvUrl}
                          download="inventory-summary.csv"
                          className="mt-4 inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
                        >
                          ⬇️ Export Summary
                        </a>
                      </DialogContent>
                    </div>
                  </Dialog>
                </div>
              )
            }
                                    
            const isOptionGroup = Array.isArray(msg.text) && msg.text.every((t) => typeof t === "string")
            const isFallback = typeof msg.text === "string" && msg.text.includes("I don't recognize") && msg.from === "bot"

            if (isOptionGroup) {
              return (
                <div key={idx} className="w-full flex justify-start">
                  <div className="grid grid-cols-1 gap-2 w-full max-w-[70%] sm:max-w-[80%] md:max-w-[80%]">
                    {(msg.text as string[]).map((option, i) => (
                      <Button key={i} variant="outline" className="w-full justify-start bg-white text-black hover:bg-orange-600 hover:text-white transition-colors" onClick={() => sendMessage(option)}>
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <div key={idx} className="w-full flex">
                <div className={`max-w-[90%] sm:max-w-[80%] md:max-w-[80%] ${msg.from === "user" ? "ml-auto" : "mr-auto"}`}>
                  <div
                    className={`
                      ${msg.from === "user" ? "bg-orange-600 text-white" : "bg-white text-black"}
                      ${isFallback ? "pointer-events-none select-text" : ""}
                      px-4 py-2 rounded-lg text-sm
                      break-words whitespace-pre-wrap
                      shadow-md mb-3
                    `}
                  >
                  {typeof msg.text === "string" ? (
                    <span className="break-words inline-block max-w-full">
                      {msg.text}
                    </span>
                  ) : ""} 
                  </div>
                </div>
              </div>
            )            
          })}

          {loading && (
            <div className="text-sm text-left">
              <div className="inline-block px-3 py-2 rounded-lg bg-white text-black animate-pulse">
                <span className="inline-block animate-bounce">.</span>
                <span className="inline-block animate-bounce delay-150">.</span>
                <span className="inline-block animate-bounce delay-300">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex items-center gap-2 mt-4">
          <Input placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>Send</Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
