"use client"

import { useEffect, useRef } from "react"

export default function ImportItemsPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // Open file dialog on mount
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("Selected file:", file.name)
    }
  }

  return (
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
  )
}
