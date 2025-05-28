"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"

import { useToast } from "@/hooks/use-toast"
import { ConfirmStatusChangeModal } from "@/components/sales/ConfirmStatusChangeModal"
import {
  DropdownMenu
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { useState } from "react"

type AwaitedOrder = {
  id: number
  orderId: number
  customerId: number | null
  customerName: string
  totalPrice: string
  orderStatus: string
  createdAt: Date
  updatedAt: Date | null
}

interface SalesOrdersTableShellProps {
  data: AwaitedOrder[]
  pageCount: number
  onStatusChange: (orderId: number, newStatus: string) => void
}

export function SalesOrdersTableShell({
  data,
  pageCount,
  onStatusChange,
}: SalesOrdersTableShellProps): JSX.Element {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const columns = React.useMemo<ColumnDef<AwaitedOrder, unknown>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            setSelectedRowIds(value ? data.map((row) => row.id) : [])
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
            setSelectedRowIds((prev) =>
              value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id)
            )
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer Name" />,
    },
    {
      accessorKey: "totalPrice",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Price" />,
    },
    {
      accessorKey: "orderStatus",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order Status" />,
      cell: ({ row }) => (
        <select
          value={row.original.orderStatus}
          onChange={(e) => {
            setSelectedOrderId(row.original.id)
            setSelectedStatus(e.target.value)
            setModalOpen(true)
          }}
          className="w-full px-2 py-1 rounded-md"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <Icons.moreHorizontal className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger> */}
        </DropdownMenu>
      ),
    },
  ], [data])

  return (
    <>
      <DataTable columns={columns} data={data} pageCount={pageCount} />

      <ConfirmStatusChangeModal
        open={modalOpen}
        newStatus={selectedStatus}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedOrderId) {
            onStatusChange(selectedOrderId, selectedStatus)
          }
          setModalOpen(false)
        }}
      />
    </>
  )
}
