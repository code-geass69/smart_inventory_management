"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ViewOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]) // Store the customer's orders
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const customerId = localStorage.getItem("customerId")
      if (!customerId) {
        alert("Please log in to view your orders")
        router.push("/signin")
        return
      }

      // Fetch orders using the customerId as a query parameter
      const res = await fetch(`/api/customers/view?customerId=${customerId}`, {
        method: "GET",
      })

      const data = await res.json()
      console.log("Orders data:", data)  // Add logging to see the response

      if (data.status === "success") {
        setOrders(data.data)  // Set orders to state
      } else {
        alert(data.message || "Failed to fetch orders")
      }
      setLoading(false)
    }

    fetchOrders()
  }, [router])

  return (
    <div className="p-4">
      <h2 className="text-2xl">Your Orders</h2>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="my-4">
            <CardHeader>
              <CardTitle>Order #{order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Order Status: {order.orderStatus}</Label>
              <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))
      )}

      <Button onClick={() => router.push("/customer/place-order")}>Place New Order</Button>
    </div>
  )
}
