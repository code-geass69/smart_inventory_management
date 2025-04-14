import { type InventoryOption } from "@/types"

export const customerOptions = [
  {
    title: "Customers",
    description: "Create and manage customers you sell to",
    buttonText: "New Customer",
    icon: "customers",
    href: "/app/sales/customers/new-customer",
  },
  {
    title: "Import Customers",
    description: "Bulk import customer records via CSV",
    buttonText: "Import Customers",
    icon: "importCustomers",
    href: "/app/sales/customers/import",
  },
  {
    title: "Export Data",
    description: "Export customer data to CSV for backup or analysis",
    buttonText: "Export Data",
    icon: "exportCustomers",
    href: "/app/sales/customers/export",
  },
  {
    title: "View Customer",
    description: "View Customer Records",
    buttonText: "View Customer",
    icon: "segments",
    href: "/app/sales/customers/view",
  },
] satisfies InventoryOption[]; // optionally rename to something more general like `CardOption[]`
