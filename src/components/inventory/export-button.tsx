"use client"
import { useState } from "react"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"

export function ExportCsvButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch("/api/items/export", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.blob()
        const link = document.createElement("a")
        link.href = URL.createObjectURL(data)
        link.download = "inventory.csv"
        link.click()
      } else {
        console.error("Error exporting inventory")
      }
    } catch (error) {
      console.error("❌ Error exporting inventory:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      disabled={isExporting}
    >
      {isExporting ? "Exporting..." : "Export Inventory"}
    </button>
  )
}
