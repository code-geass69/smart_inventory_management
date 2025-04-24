"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function EditItemPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const router = useRouter()

  const [itemData, setItemData] = useState({
    name: "",
    category: "",
    brand: "",
    quantity: 0,
    reorderPoint: 0,
    sku: "",
    sellingPrice: 0,
    unit: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const res = await fetch(`/api/inventory/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = await res.json()

        if (res.ok) {
          setItemData(data)
        } else {
          toast({
            description: data.message || "Failed to fetch item data",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          description: "Error fetching item data",
          variant: "destructive",
        })
      }
    }

    if (id) fetchItemData()
  }, [id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const res = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          description: data.message || "Item updated successfully",
          variant: "default",
        })
        router.push("/app/inventory/view-inventory")
      } else {
        toast({
          description: data.message || "Failed to update item",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        description: "Error updating item",
        variant: "destructive",
      })
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block">Item Name</label>
          <span className="block">{itemData.name}</span> 
        </div>

        <div className="space-y-2">
          <label htmlFor="quantity" className="block">Quantity</label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={itemData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="reorderPoint" className="block">Reorder Point</label>
          <Input
            id="reorderPoint"
            name="reorderPoint"
            type="number"
            value={itemData.reorderPoint}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sku" className="block">SKU</label>
          <Input
            id="sku"
            name="sku"
            value={itemData.sku}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sellingPrice" className="block">Selling Price</label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            value={itemData.sellingPrice}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
