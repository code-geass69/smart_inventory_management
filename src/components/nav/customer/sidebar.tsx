"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [customerName, setCustomerName] = useState("Customer")
  const pathname = usePathname()

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

  const links = [
    { href: "/customer/place-order", label: "Place Order" },
    { href: "/customer/view-orders", label: "View Orders" },
    { href: "/customer/track", label: "Track Order" },
    { href: "/customer/invoice", label: "Invoice" },
  ]

  return (
    <aside className="w-64 h-screen bg-[#0F172A] text-white flex flex-col justify-between border-r border-gray-700 shadow-md">
      <div>
        <div className="px-6 py-4 text-lg font-bold border-b border-gray-700 pt-9">
          Zaiko
        </div>
        <nav className="flex flex-col text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-6 py-3 transition-colors duration-200",
                pathname === link.href
                  ? "bg-blue-600 text-white shadow-inner"
                  : "hover:bg-blue-900 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 text-xs text-center border-t border-gray-700">
        Welcome <strong>{customerName}</strong>
      </div>
    </aside>
  )
}
