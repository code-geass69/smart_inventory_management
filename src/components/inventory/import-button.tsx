"use client"

import { useRef } from "react"
import { importItemsFromCsv } from "@/actions/inventory/import-csv" 
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"

export function ImportCsvButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()

    const result = await importItemsFromCsv(text)
    console.log("Import result: ", result)
  }

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-2")}
      >
        Import Items
      </button>
    </>
  )
}
