"use client"

import * as React from "react"

import { type Customer } from "@/db/schema"
import type { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

type AwaitedCustomer = Pick<Customer, "id" | "name" | "email" | "phone_number" | "address">

interface CustomerTableShellProps {
    data: AwaitedCustomer[]
    pageCount: number
}

export function CustomerTableShell({
    data,
    pageCount,
}: CustomerTableShellProps): JSX.Element {
    const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])

    const columns = React.useMemo<ColumnDef<AwaitedCustomer, unknown>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value)
                        setSelectedRowIds((prev) =>
                            prev.length === data.length ? [] : data.map((row) => row.id)
                        )
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value)
                        setSelectedRowIds((prev) =>
                            value
                                ? [...prev, row.original.id]
                                : prev.filter((id) => id !== row.original.id)
                        )
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
        },
        {
            accessorKey: "phone_number",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Phone Number" />
            ),
        },
        {
            accessorKey: "address",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Address" />
            ),
        },
    ], [data])

    return (
        <div className="w-full overflow-x-auto">
            <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                searchableColumns={[
                    { id: "name", title: "Customer Name" },
                    { id: "email", title: "Email" },
                ]}
            />
        </div>
    )
}
