"use client"
import { useRef } from "react"
import { ImportCsvButton } from "@/components/inventory/import-button"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { type InventoryOption } from "@/types"
import Balancer from "react-wrap-balancer"
import { importItemsFromCsv } from "@/actions/inventory/import-csv"
import Link from "next/link"

interface OptionCardProps {
  option: InventoryOption
}

export function OptionCard({ option }: OptionCardProps) {
  const Icon = Icons[option.icon as keyof typeof Icons]
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Handle file change for importing CSV
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()

    // Call the backend function to process the CSV
    const result = await importItemsFromCsv(text)
    console.log("Import result: ", result)
  }

  // Handle export for the inventory data
  const handleExport = async () => {
    try {
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
    }
  }

  return (
    <div
      key={option.title}
      className="flex flex-col items-center justify-center gap-4 rounded-md bg-tertiary p-10 transition-all duration-300 ease-in-out hover:bg-secondary/60 xl:p-16"
    >
      <h3 className="text-xl font-semibold tracking-wide">{option.title}</h3>
      <Icon
        className="h-14 w-14 text-foreground/40 xl:h-18 xl:w-18"
        aria-hidden="true"
      />
      <p className="max-w-xs text-center text-sm tracking-wide text-muted-foreground">
        <Balancer>{option.description}</Balancer>
      </p>
      {option.title === "Add Items via CSV" ? (
        <>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "mt-2"
            )}
          >
            {option.buttonText}
          </button>
        </>
      ) : option.title === "Export Data" ? (
        // Export data button
        <button
          type="button"
          onClick={handleExport}  // Trigger export onClick
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-2"
          )}
        >
          {option.buttonText}
        </button>
      ) : (
        <Link
          href={option.href}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-2"
          )}
          aria-label={`Select ${option.buttonText}`}
        >
          {option.buttonText}
        </Link>
      )}
    </div>
  )
}
