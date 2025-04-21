"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function Sidebar() {
  const [customerName, setCustomerName] = useState("Customer")

  useEffect(() => {
    const email = localStorage.getItem("customerEmail")
    if (email) {
      fetch(`/api/customers/name?email=${encodeURIComponent(email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) setCustomerName(data.name)
        })
        .catch(() => setCustomerName("Customer"))
    }
  }, [])

  return (
    <aside className="w-64 h-screen bg-[#0F172A] text-white flex flex-col justify-between">
      <div>
        <div className="px-6 py-4 text-lg font-bold border-b border-gray-700 pt-9">Arcline Logistics</div>
        <nav className="flex flex-col gap-4 p-6 text-sm font-bold">
          <Link href="/customer/place-order" className="hover:text-blue-400">Place Order</Link>
          <Link href="/customer/orders" className="hover:text-blue-400">View Orders</Link>
          <Link href="/customer/track" className="hover:text-blue-400">Track Order</Link>
          <Link href="/customer/invoice" className="hover:text-blue-400">Invoice</Link>
        </nav>
      </div>
      <div className="p-4 text-xs text-center border-t border-gray-700">
        Welcome <strong>{customerName}</strong>
      </div>
    </aside>
  )
}
