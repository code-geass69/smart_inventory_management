"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { SalesOrdersTableShell } from "@/components/data-table/table-shells/sales-orders-table-shell"
import { useToast } from "@/hooks/use-toast"
import { salesOrdersSearchParamsSchema } from "@/validations/params"
import { Icons } from "@/components/icons"

export default function AppSalesOrdersPageWrapper({
  searchParams,
}: {
  searchParams: any
}) {
  const { toast } = useToast()
  const [data, setData] = useState<
    {
      id: number
      orderId: number
      customerId: number | null
      customerName: string
      totalPrice: string
      orderStatus: string
      createdAt: Date
      updatedAt: Date | null
    }[]
  >([])
  const [pageCount, setPageCount] = useState(1)

  const parsedParams = React.useMemo(() => {
    return salesOrdersSearchParamsSchema.parse(searchParams)
  }, [searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sales/get-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsedParams,
            perPage: parsedParams.per_page,
            sort: parsedParams.sort || "createdAt.desc",
          }),
        })

        const result = await res.json()
        setData(
          result.data.map((order: any) => ({
            id: order.id,
            orderId: order.orderId,
            customerId: order.customerId,
            customerName: order.customerName,
            totalPrice: order.totalPrice,
            orderStatus: order.orderStatus,
            createdAt: new Date(order.createdAt),
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : null,
          }))
        )
        setPageCount(Math.ceil(result.count / (parsedParams.per_page || 10)))
      } catch (err) {
        toast({ description: "Failed to fetch orders", variant: "destructive" })
      }
    }

    fetchData()
  }, [parsedParams])

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/sales/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      })
      const json = await res.json()
      if (res.ok) {
        toast({ description: json.message, variant: "default" })
      } else {
        toast({ description: json.message, variant: "destructive" })
      }
    } catch (err) {
      toast({ description: "Error updating order status", variant: "destructive" })
    }
  }

  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer Name", "Total Price", "Order Status", "Created At"]
    const csvRows = [
      headers.join(","),
      ...data.map(order => [
        order.orderId,
        `"${order.customerName}"`,
        order.totalPrice,
        order.orderStatus,
        order.createdAt.toLocaleString()
      ].join(","))
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "sales-orders.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-5">
      {data.length === 0 ? (
        <DataTableSkeleton columnCount={8} isNewRowCreatable isRowsDeletable={false} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-semibold">Sales Orders</div>
            <Button
              onClick={handleExportCSV}
              className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-3 py-1 rounded flex items-center gap-1"
            >
              <Icons.download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <SalesOrdersTableShell
            data={data}
            pageCount={pageCount}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </div>
  )
}
