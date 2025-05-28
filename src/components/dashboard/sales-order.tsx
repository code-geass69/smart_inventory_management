"use client"

import { useEffect, useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function SalesOrder(): JSX.Element {
  const [forecast, setForecast] = useState<{ month: string; units: number }[]>([])
  const [revenue, setRevenue] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/predictions")
      const data = await res.json()

      const chartData = data.salesForecast.map((val: number, index: number) => ({
        month: monthNames[index + 6],
        units: Math.round(val)
      }))

      setForecast(chartData)
      setRevenue(data.revenuePrediction || 0)
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-80 w-full flex-col whitespace-nowrap rounded-md border bg-tertiary transition-all duration-300 ease-in-out hover:bg-secondary/30 xl:w-2/3">
      <div className="flex h-16 items-center justify-between bg-secondary/20 px-5">
        <h3 className="shrink-0 font-semibold capitalize tracking-wide">Raw Sales Order Prediction</h3>
      
      </div>

      <div className="flex h-full border-t">
        <div className="w-2/3 px-6 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="units" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/3 flex flex-col justify-center items-start gap-2 px-4">
          <p className="text-md font-medium text-muted-foreground">📈 Sales Summary</p>
          {forecast.map((f, i) => (
            <p key={i} className="text-sm text-white">{f.month}: {f.units} units</p>
          ))}
          <p className="mt-2 text-sm text-orange-400 font-semibold">💰 Total Predicted Revenue: ₹{revenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
