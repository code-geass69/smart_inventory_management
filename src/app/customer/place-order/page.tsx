"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type Item = {
    id: number
    name: string
    sellingPrice: number
    quantity: number
}

export default function PlaceOrderPage() {
    const [items, setItems] = useState<Item[]>([])
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const router = useRouter()

    useEffect(() => {
        const fetchItems = async () => {
            const res = await fetch("/api/items/available")
            const data = await res.json()
            setItems(data)
        }

        fetchItems()
    }, [])

    const handleQuantityChange = (id: number, value: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handlePlaceOrder = async () => {
        const customerId = localStorage.getItem("customerId")

        if (!customerId) {
            alert("You must be logged in as a customer to place an order.")
            return
        }

        const selectedItems = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({
                itemId: Number(id),
                quantity: qty,
            }))

        if (selectedItems.length === 0) {
            alert("Please select at least one item.")
            return
        }

        const res = await fetch("/api/customer/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, items: selectedItems }),
        })

        const result = await res.json()

        if (result.status === "success") {
            alert("Order placed successfully!")
            router.push("/customer/orders")
        } else {
            alert("Failed to place order.")
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 text-white">Place Your Order</h1>

            {items.length === 0 ? (
                <p className="text-muted-foreground">No items available right now.</p>
            ) : (
                <div className="space-y-6">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price: ₹{item.sellingPrice}</p>
                                    <p className="text-sm text-muted-foreground">In stock: {item.quantity}</p>
                                </div>
                                <div className="w-24">
                                    <Label htmlFor={`qty-${item.id}`}>Qty</Label>
                                    <Input
                                        type="number"
                                        id={`qty-${item.id}`}
                                        min={0}
                                        max={item.quantity}
                                        value={quantities[item.id] || ""}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, parseInt(e.target.value || "0"))
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card>
                        <CardFooter className="justify-end">
                            <Button onClick={handlePlaceOrder}>Place Order</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    )
}
