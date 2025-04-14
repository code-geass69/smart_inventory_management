"use client"

import { useRef } from "react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { type InventoryOption } from "@/types"
import Balancer from "react-wrap-balancer"
import Link from "next/link"

interface OptionCardProps {
  option: InventoryOption
}

export function CustomerOptionCard({ option }: OptionCardProps) {
const Icon = Icons[option.icon as keyof typeof Icons] ?? Icons["items"];
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    // placeholder: call importCustomersFromCsv(text) here when ready
    console.log("📥 Imported file content:", text)
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/items/export", {
        method: "GET",
      })

      if (response.ok) {
        const blob = await response.blob()
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "customers.csv" // still label it as customers.csv
        link.click()
      } else {
        console.error("Error exporting (fallback: items export)")
      }
    } catch (error) {
      console.error("❌ Error exporting fallback items CSV:", error)
    }
  }

  return (
    <div
      key={option.title}
      className="flex flex-col items-center justify-center gap-4 rounded-md bg-tertiary p-10 transition-all duration-300 ease-in-out hover:bg-secondary/60 xl:p-16"
    >
      <h3 className="text-xl font-semibold tracking-wide">{option.title}</h3>
      <Icon className="h-14 w-14 text-foreground/40 xl:h-18 xl:w-18" />
      <p className="max-w-xs text-center text-sm tracking-wide text-muted-foreground">
        <Balancer>{option.description}</Balancer>
      </p>

      {option.title === "Import Customers" ? (
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
        <button
          type="button"
          onClick={handleExport}
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
        >
          {option.buttonText}
        </Link>
      )}
    </div>
  )
}
