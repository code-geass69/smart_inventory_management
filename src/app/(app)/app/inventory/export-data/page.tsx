"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Papa from "papaparse"

export default function ImportItems(): JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      })
      return
    }

    // Parse the CSV file
    Papa.parse(file, {
      complete: async (result) => {
        const data = result.data
        // Validate the parsed data and send it to the backend
        try {
          const res = await fetch("/api/items/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: data }),
          })

          const response = await res.json()
          if (response.status === "success") {
            toast({ title: "Success", description: "Items imported successfully." })
            router.push("/app/inventory/items")
          } else {
            toast({ title: "Error", description: "Failed to import items.", variant: "destructive" })
          }
        } catch (error) {
          console.error(error)
          toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
        }
      },
      header: true, // Expect CSV with headers
    })
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-black text-white rounded-md shadow-md w-1/3 mx-auto">
      <h2 className="text-2xl font-semibold">Import Items via CSV</h2>
      <div className="flex flex-col items-center">
        <label className="cursor-pointer">
          <Input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv"
          />
          <Button
            className="w-full bg-white text-black hover:bg-gray-200 border-2 border-gray-600"
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            {file ? file.name : "Choose File"}
          </Button>
        </label>
      </div>

      {file && (
        <div className="text-sm text-gray-400">
          <span>{file.name}</span>
        </div>
      )}

      <Button
        onClick={handleUpload}
        className="mt-4 w-full bg-white text-black hover:bg-gray-200 border-2 border-gray-600"
      >
        Upload CSV
      </Button>
    </div>
  )
}
