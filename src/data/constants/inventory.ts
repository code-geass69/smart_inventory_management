import {
  type InventoryCompositeItemSelectOption,
  type InventoryItemGroupsSelectOption,
  type InventoryItemsSelectOption,
  type InventoryOption,
} from "@/types"
export const inventoryOptions = [
  {
    title: "Items",
    description: "Create standalone items and services that you buy and sell",
    buttonText: "New Item",
    icon: "items",
    href: "/app/inventory/items/new-item",
  },
  {
    title: "Add Items via CSV",
    description: "Bulk import items from a CSV file",
    buttonText: "Import Items",
    icon: "itemGroups",
    href: "",
  },
  {
    title: "Export Data",
    description: "Export inventory data to CSV",
    buttonText: "Export Data",
    icon: "compositeItems",
    href: "/app/inventory/export-data", 
  },
  {
    title: "Price Lists",
    description: "Tweak your item prices for specific contacts or transactions",
    buttonText: "New Price List",
    icon: "priceLists",
    href: "/app/inventory/price-lists/new-list",
  },
] satisfies InventoryOption[]

export const inventoryItemsSelectOptions = [
  {
    value: "all-items",
    title: "All Items",
  },
  {
    value: "active-items",
    title: "Active Items",
  },
  {
    value: "ungrouped-items",
    title: "Ungrouped Items",
  },
  {
    value: "low-stock-items",
    title: "Low Stock Items",
  },
  {
    value: "sales",
    title: "Sales",
  },
  {
    value: "purchases",
    title: "Purchases",
  },
  {
    value: "inventory-items",
    title: "Inventory Items",
  },
  {
    value: "non-inventory-items",
    title: "Non-Inventory Items",
  },
  {
    value: "services",
    title: "Services",
  },
  {
    value: "inactive-items",
    title: "Inactive Items",
  },
  {
    value: "returnable-items",
    title: "Returnable Items",
  },
  {
    value: "non-returnable-items",
    title: "Non Returnable Items",
  },
] satisfies InventoryItemsSelectOption[]

export const inventoryItemGroupsSelectOptions = [
  {
    value: "all-item-groups",
    title: "All Item Groups",
  },
  {
    value: "active-item-groups",
    title: "Active Item Groups",
  },
  {
    value: "inactive-item-groups",
    title: "Inactive Item Groups",
  },
] satisfies InventoryItemGroupsSelectOption[]

export const inventoryCompoiteItemsSelectOption = [
  {
    value: "all-composite-items",
    title: "All Composite Items",
  },
  {
    value: "ungrouped-items",
    title: "Ungrouped Items",
  },
  {
    value: "active",
    title: "Active",
  },
  {
    value: "low-stock",
    title: "Low Stock",
  },
  {
    value: "inactive",
    title: "Inactive",
  },
] satisfies InventoryCompositeItemSelectOption[]
