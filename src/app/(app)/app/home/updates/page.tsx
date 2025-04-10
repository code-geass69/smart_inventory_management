"use client"

import { useEffect, useState } from "react"

export default function AppdHomeUpdatesPage(): JSX.Element {
  const [inventoryItems, setInventoryItems] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/inventory/reorder-vs-quantity")
      const data = await res.json()
      setInventoryItems(data)
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      {inventoryItems.length === 0 ? (
        <p className="text-muted-foreground">All items are sufficiently stocked ✅</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inventoryItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-red-300 bg-red-50 p-5 shadow transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-red-800">{item.name}</h2>
              <p className="text-sm mt-1">
                <span className="font-medium text-gray-700">Quantity:</span>{" "}
                <span className="text-red-700">{item.quantity}</span>
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium text-black">Reorder Point:</span>{" "}
                <span className="text-black">{item.reorderPoint}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-red-600">
                ⚠️ Restock needed
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
